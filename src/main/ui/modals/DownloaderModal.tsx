import type {
  DownloaderEndInfo,
  DownloaderInitInfo
} from "../../types/MainEvents";
import type { DownloaderLogMessage } from "../../DownloaderConsoleLogger";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import type { JSX } from "react";
import { Button, Modal } from "react-bootstrap";
import ReactDOMServer from "react-dom/server";

// Keep a bounded in-memory history so hiding and reopening never loses the log.
// The on-screen log remains limited to 3,000 entries. The export buffer is
// independent, up to 32 MiB, to retain earlier messages from this run.
const MAX_MESSAGES = 3000;
const MAX_EXPORT_CHARS = 32 * 1024 * 1024;

type DownloaderState =
  | {
      status: "init";
      info: DownloaderInitInfo;
    }
  | {
      status: "running";
    }
  | {
      status: "end";
      info: DownloaderEndInfo;
    };

type ContentType = "string" | "element" | "object" | "log";
type ContentValue<T extends ContentType> =
  T extends "string" ? string
  : T extends "element" ? JSX.Element
  : T extends "object" ? object
  : T extends "log" ? DownloaderLogMessage
  : never;

interface ContentsScrollParams {
  autoScroll: boolean;
  ignoreNextScroll: boolean;
}

function DownloaderModal() {
  const [state, setState] = useState<DownloaderState | null>(null);
  const [show, setShow] = useState(false);
  const manuallyHiddenRef = useRef(false);
  const historyRef = useRef<string[]>([]);
  const exportHistoryRef = useRef<string[]>([]);
  const exportCharsRef = useRef(0);
  const exportDroppedRef = useRef(0);
  const contentsBufferRef = useRef("");
  const contentsFlushTimerRef = useRef<NodeJS.Timeout>(null);
  const contentsElRef = useRef<HTMLDivElement>(null);
  const contentsScrollParamsRef = useRef<ContentsScrollParams>({
    autoScroll: true,
    ignoreNextScroll: false
  });
  const flushContentsBuffer = useCallback(() => {
    const contentsEl = contentsElRef.current;
    if (contentsEl && contentsBufferRef.current) {
      // v2.5.4: incremental append avoids reparsing all previous messages.
      contentsEl.insertAdjacentHTML("beforeend", contentsBufferRef.current);
      while (contentsEl.childElementCount > MAX_MESSAGES) {
        contentsEl.firstElementChild?.remove();
      }
      if (contentsScrollParamsRef.current.autoScroll) {
        contentsEl.scrollTop = contentsEl.scrollHeight;
      }
    }
    // Messages already live in historyRef; do not grow an invisible HTML buffer.
    contentsBufferRef.current = "";
  }, []);

  const clearContentsFlushTimer = useCallback(() => {
    if (contentsFlushTimerRef.current) {
      clearTimeout(contentsFlushTimerRef.current);
      contentsFlushTimerRef.current = null;
    }
  }, []);

  const startContentsFlushTimer = useCallback(() => {
    if (contentsFlushTimerRef.current) {
      return;
    }
    contentsFlushTimerRef.current = setTimeout(() => {
      flushContentsBuffer();
      contentsFlushTimerRef.current = null;
    }, 200);

    return () => {
      clearContentsFlushTimer();
    };
  }, [flushContentsBuffer, clearContentsFlushTimer]);

  const updateContents = useCallback(
    <T extends ContentType>(
      type: T,
      value: ContentValue<T>,
      append = false
    ) => {
      let content = "";
      switch (type) {
        case "string":
          content = value as string;
          break;
        case "object":
          content = JSON.stringify(value, null, 2);
          break;
        case "element":
          content = ReactDOMServer.renderToString(value as JSX.Element);
          break;
        case "log":
          content = (value as DownloaderLogMessage).text;
          break;
      }
      if (!append) {
        contentsBufferRef.current = "";
        historyRef.current = [];
        exportHistoryRef.current = [];
        exportCharsRef.current = 0;
        exportDroppedRef.current = 0;
        if (contentsElRef.current) contentsElRef.current.innerHTML = "";
      }
      if (content) {
        const entry = `<div>${content}</div>`;
        // v2.5.5: keep an independent export history (not limited by UI rows).
        const exportEntry = content.slice(-MAX_EXPORT_CHARS);
        exportHistoryRef.current.push(exportEntry);
        exportCharsRef.current += exportEntry.length;
        if (exportEntry.length < content.length) exportDroppedRef.current++;
        while (exportCharsRef.current > MAX_EXPORT_CHARS && exportHistoryRef.current.length > 1) {
          const removed = exportHistoryRef.current.shift();
          if (removed !== undefined) exportCharsRef.current -= removed.length;
          exportDroppedRef.current++;
        }
        historyRef.current.push(entry);
        if (historyRef.current.length > MAX_MESSAGES) {
          historyRef.current.splice(0, historyRef.current.length - MAX_MESSAGES);
        }
        if (contentsElRef.current) contentsBufferRef.current += entry;
      }
      startContentsFlushTimer();
    },
    [clearContentsFlushTimer, startContentsFlushTimer]
  );

  // Stable ref: do not reconstruct the entire log on unrelated React re-renders.
  const attachContentsEl = useCallback((node: HTMLDivElement | null) => {
    contentsElRef.current = node;
    if (node) {
      // React-Bootstrap unmounts Modal.Body after hiding; restore retained history.
      node.innerHTML = historyRef.current.join("");
      contentsBufferRef.current = "";
      if (contentsScrollParamsRef.current.autoScroll) {
        node.scrollTop = node.scrollHeight;
      }
    }
  }, []);

  const downloadLog = useCallback(async () => {
    const snapshot = exportHistoryRef.current.slice();
    if (!snapshot.length) return;
    // Convert existing rendered message HTML into plain text. No styles or tags
    // are included in the saved file; timestamps and log details stay intact.
    const scratch = document.createElement("div");
    const lines = snapshot.map((html) => {
      scratch.innerHTML = html;
      return scratch.textContent ?? "";
    });
    if (exportDroppedRef.current) {
      lines.unshift(`[SpeedFix] Older ${exportDroppedRef.current} message(s) omitted: in-memory export limit reached (32 MiB). Enable File logger for unbounded history.`);
    }
    try {
      const result = await window.mainAPI.invoke("exportDownloadLog", lines.join("\r\n") + "\r\n");
      if (!result.saved && !result.canceled) {
        window.alert(`Could not save download log: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      window.alert(`Could not save download log: ${String(error)}`);
    }
  }, []);

  const clearMessages = useCallback(() => {
    updateContents("string", "");
  }, [updateContents]);

  const wrapText = useCallback(() => {
    const contentsEl = contentsElRef.current;
    if (contentsEl) {
      if (contentsEl.style.whiteSpace === "pre") {
        contentsEl.style.whiteSpace = "pre-wrap";
      } else {
        contentsEl.style.whiteSpace = "pre";
      }
    }
  }, []);

  const close = useCallback(() => {
    manuallyHiddenRef.current = true;
    setShow(false);
  }, []);

  const end = useCallback(() => {
    window.mainAPI.emitMainEvent("downloaderModalClose");
  }, []);

  const confirmStartDownload = useCallback(
    (confirmed: boolean) => {
      window.mainAPI.emitMainEvent("confirmStartDownload", {
        confirmed
      });
      if (!confirmed) {
        close();
      }
    },
    [close]
  );

  useEffect(() => {
    const removeListenerCallbacks = [
      window.mainAPI.on("downloaderInit", (info) => {
        manuallyHiddenRef.current = false;
        contentsScrollParamsRef.current.autoScroll = false;
        if (info.hasError) {
          updateContents("string", info.error);
        } else {
          const { fileLoggerConfig, downloaderConfig } = info;
          let s = "";
          if (fileLoggerConfig.enabled) {
            s += `Log file: ${fileLoggerConfig.logFilePath}\n\n`;
          }
          s += "Downloader config\n";
          s += "-----------------\n";
          s += JSON.stringify(downloaderConfig, null, 2);
          updateContents("string", s);
        }
        setState({
          status: "init",
          info
        });
        setShow(true);
        if (!info.hasError && !info.prompt) {
          confirmStartDownload(true);
        }
      }),
      window.mainAPI.on("downloaderStart", () => {
        contentsScrollParamsRef.current.autoScroll = true;
        setState({
          status: "running"
        });
        if (!manuallyHiddenRef.current) setShow(true);
      }),
      window.mainAPI.on("downloaderEnd", (info) => {
        clearContentsFlushTimer();
        flushContentsBuffer();
        if (info.hasError) {
          updateContents(
            "string",
            `Downloader exited with uncaught error: ${info.error}`,
            true
          );
        } else if (info.aborted) {
          updateContents("string", `Downloader exited due to abort`, true);
        } else {
          updateContents("string", `Downloader exited`, true);
        }
        setState({
          status: "end",
          info
        });
        if (!manuallyHiddenRef.current) setShow(true);
      }),
      window.mainAPI.on("downloaderLogMessage", (message) => {
        updateContents("log", message, true);
      }),
      window.mainAPI.on("showDownloadLog", () => {
        manuallyHiddenRef.current = false;
        setShow(true);
      })
    ];

    return () => {
      removeListenerCallbacks.forEach((cb) => cb());
    };
  }, [
    updateContents,
    clearContentsFlushTimer,
    flushContentsBuffer,
    confirmStartDownload
  ]);

  const abortDownload = useCallback(async () => {
    await window.mainAPI.invoke("abortDownload");
  }, []);

  const title = useMemo(() => {
    if (!state) {
      return "";
    }
    switch (state.status) {
      case "init":
        return state.info.hasError ?
            "Could not create downloader instance"
          : "Downloader ready";
      case "running":
        return "Download in progress...";
      case "end":
        return (
          state.info.hasError ? "Download ended with uncaught error"
          : state.info.aborted ? "Download aborted"
          : "Download finished"
        );
    }
  }, [state]);

  const message =
    state?.status === "init" && !state.info.hasError ?
      state.info.prompt ?
        "Proceed?"
      : "Download will begin shortly..."
    : null;

  const headerButtons = useMemo(() => {
    if (!state) {
      return;
    }
    return (
      <>
        <Button
          size="sm"
          variant="dark"
          className="rounded me-2"
          title="Save this session's download log as a UTF-8 text file"
          onClick={downloadLog}
          aria-label="Download Log"
        >
          <span className="material-symbols-outlined" style={{ lineHeight: "inherit" }}>download</span>
          <span className="ms-1">Download Log</span>
        </Button>
        <Button
          size="sm"
          variant="dark"
          className="rounded me-2"
          title="Wrap text"
          onClick={wrapText}
          aria-label="Wrap text"
        >
          <span
            className="material-symbols-outlined"
            style={{ lineHeight: "inherit" }}
          >
            wrap_text
          </span>
        </Button>
        <Button
          size="sm"
          variant="dark"
          className="rounded me-2"
          title="Clear messages"
          onClick={clearMessages}
          aria-label="Clear messages"
        >
          <span
            className="material-symbols-outlined"
            style={{ lineHeight: "inherit" }}
          >
            delete
          </span>
        </Button>
      </>
    );
  }, [state, downloadLog]);

  const footerButtons = useMemo(() => {
    if (!state) {
      return null;
    }
    switch (state.status) {
      case "init":
        return (
          state.info.hasError ?
            <Button variant="secondary" onClick={close} aria-label="Close">
              Close
            </Button>
          : state.info.prompt ?
            <>
              <Button
                variant="secondary"
                onClick={() => confirmStartDownload(false)}
                aria-label="Cancel download"
              >
                Cancel
              </Button>
              <Button
                onClick={() => confirmStartDownload(true)}
                aria-label="Proceed"
              >
                Proceed
              </Button>
            </>
          : null
        );
      case "running":
        return (
          <>
          <Button variant="secondary" className="me-2" onClick={close} aria-label="Hide Log">
            Hide Log
          </Button>
          <Button
            variant="danger"
            onClick={abortDownload}
            aria-label="Abort download"
          >
            Abort
          </Button>
          </>
        );
      case "end":
        return (
          <Button variant="secondary" onClick={close} aria-label="Close">
            Close
          </Button>
        );
    }
  }, [state]);

  const onContentsScroll = useCallback(() => {
    const bodyEl = contentsElRef.current;
    const scrollParams = contentsScrollParamsRef.current;
    if (bodyEl) {
      if (!scrollParams.ignoreNextScroll) {
        scrollParams.autoScroll =
          bodyEl.scrollTop >= bodyEl.scrollHeight - bodyEl.clientHeight - 100;
      } else {
        scrollParams.ignoreNextScroll = false;
      }
    }
  }, []);

  if (!state) {
    return null;
  }

  return (
    <>
      <Modal
        dialogClassName="speedfix-log-modal"
        contentClassName="h-100"
        show={show}
        onHide={close}
        onExited={end}
        backdrop="static"
        keyboard={false}
        scrollable={true}
        size="xl"
        fullscreen="lg-down"
        centered
      >
        <Modal.Header className="bg-dark">
          <Modal.Title>
            <div className="d-flex flex-column">
              <span>{title}</span>
              {message ?
                <span className="mt-2 fs-5">{message}</span>
              : null}
            </div>
          </Modal.Title>
          <div className="d-flex flex-grow-1 justify-content-end">
            {headerButtons}
          </div>
        </Modal.Header>
        <Modal.Body
          className="p-2 flex-grow-1 overflow-auto bg-black text-light font-monospace"
          style={{ whiteSpace: "pre" }}
          ref={attachContentsEl}
          onScroll={onContentsScroll}
        ></Modal.Body>
        <Modal.Footer className="bg-dark justify-content-center">
          {footerButtons}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DownloaderModal;
