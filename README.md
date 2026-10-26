<!-- SPEEDFIX-FORK-INTRO-BEGIN -->
# Patreon Downloader GUI — cw3 + SpeedFix

**GUI `2.10.3-cw3` · SpeedFix `v2.5.5` · Core `3.9.0-speedfix.255` · Windows x64 installer**

[**Download the latest release (MSI)**](https://github.com/minimoonleaf/patreon-dl-gui-cw3-speedfix/releases/latest) · [**All releases**](https://github.com/minimoonleaf/patreon-dl-gui-cw3-speedfix/releases) · [**SpeedFix Core**](https://github.com/minimoonleaf/patreon-dl-core-speedfix) · [**cw3 details**](./README-cw3.md) · [**cw3 日本語説明**](./README-cw3_jp.md)

> **Unofficial community fork.** This is not an official release by Patrick Kan or Moe Haduki. It combines the original Patreon Downloader GUI, community cw3 URL-handling improvements, and SpeedFix downloader optimizations.

## What's included? (English)

- **cw3 Patreon URL handling:** Improves recognition of creator and individual-post URLs following Patreon site changes. Includes the cw3 `custom-rules.json` mechanism for additional URL prefixes; see [cw3 documentation](./README-cw3.md).
- **Fast Skip:** Reduces unnecessary per-post API refreshes for posts validated as unchanged by the existing status cache and available API metadata.
- **Optimized Core:** Uses SpeedFix Core `3.9.0-speedfix.255`, with up to four concurrent preparation workers, paced/cached HEAD requests, and adaptive HTTP 429 handling.
- **Improved download log window:** Offers an enhanced log view and reopening through **View → Show Download Log** (`Ctrl+Shift+L`) without intentionally stopping an active download.
- **Export Download Log:** Saves diagnostic log output to a UTF-8 text file for troubleshooting.
- **Performance diagnostics:** Includes Fast Skip counts, page wall times, preparation statistics, and other download performance information.

### Installation (Windows x64)

1. Open the [GitHub Releases page](https://github.com/minimoonleaf/patreon-dl-gui-cw3-speedfix/releases).
2. Download the **Windows x64 `.msi` installer** attached to the intended release. The generated **Source code** archives are *not* Windows installers.
3. Install the app and follow the original GUI usage guide below. FFmpeg is recommended for video downloads; yt-dlp and Deno may be needed for particular embed downloaders.

**Source/build note:** This GUI's `package.json` depends on `file:vendor/patreon-dl-3.9.0-speedfix.255.tgz`. Because the prebuilt Core tarball is not included in the source repository, build and `npm pack` the [SpeedFix Core](https://github.com/minimoonleaf/patreon-dl-core-speedfix) **before** installing GUI dependencies. See [Building this fork from source](#running--packaging-the-app-from-source) below.

**Versioning:** The ongoing GUI branch is `cw3-speedfix`; [`v2.5.5-cw3-speedfix`](https://github.com/minimoonleaf/patreon-dl-gui-cw3-speedfix/tree/v2.5.5-cw3-speedfix) identifies this released source. The internal `package.json` version remains `2.10.3` for packaging compatibility; it is not the SpeedFix feature version.

## 繁體中文說明

這是整合 **Patrick Kan 原始 GUI、Moe Haduki 的 cw3 修正，以及 SpeedFix v2.5.5** 的社群維護版本，並搭配 `3.9.0-speedfix.255` 核心。

- **cw3 URL 辨識：** 改善 Patreon 創作者及單篇貼文的網址辨識，並支援 `custom-rules.json` 自訂網址前綴規則。
- **Fast Skip：** 在狀態快取及 API 資料符合驗證條件時，減少不必要的逐篇重新請求。
- **下載最佳化：** 加速下載前的任務準備、HEAD 快取與節流，並加入 HTTP 429 防護。
- **下載 Log：** 改善日誌視窗，可以透過 **View → Show Download Log**（`Ctrl+Shift+L`）重新開啟；支援匯出 UTF-8 日誌。
- **效能診斷：** 顯示跳過統計、分頁處理耗時及下載準備資訊。

**Windows 安裝：** 請到 [Releases](https://github.com/minimoonleaf/patreon-dl-gui-cw3-speedfix/releases) 下載附加的 `.msi` 安裝檔。GitHub 自動產生的 Source code ZIP 並不是安裝程式。

**自行編譯：** 需先編譯並封裝 [SpeedFix Core](https://github.com/minimoonleaf/patreon-dl-core-speedfix)，將 `.tgz` 放入 GUI 的 `vendor` 資料夾後，才能安裝 GUI 的相依套件。

## Credits / 授權與致謝

- Original GUI and Core: [Patrick Kan (@patrickkfkan)](https://github.com/patrickkfkan/patreon-dl-gui), [Core upstream](https://github.com/patrickkfkan/patreon-dl).
- cw3 custom build and URL-rule improvements: [Moe Haduki (@hadukimoe)](https://github.com/patrickkfkan/patreon-dl-gui/issues/85). The original [cw3 documentation](./README-cw3.md) and [Japanese documentation](./README-cw3_jp.md) are retained.
- Earlier URL-fix contributions credited in cw3 documentation: [@tiansun2](https://github.com/tiansun2), [@ma7m0d999](https://github.com/ma7m0d999).
- SpeedFix integration and maintenance: [minimoonleaf](https://github.com/minimoonleaf).
- Original copyright, MIT license, and existing attribution notices remain applicable. Retain these in redistributed versions.

The remainder of this README retains and adapts the original GUI's feature and usage documentation. The original project's donation link below belongs to the original maintainer, not the SpeedFix maintainer.
<!-- SPEEDFIX-FORK-INTRO-END -->

---

<a href='https://ko-fi.com/minimoonleaf' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Original GUI project documentation
An Electron app that provides a GUI for [patreon-dl SpeedFix Core](https://github.com/minimoonleaf/patreon-dl-core-speedfix).

## Features

- Download posts by a creator, in a collection or single post. Includes patron-only content provided you have a subscription to access it.
- Download products purchased from a creator's shop.
- Items included in downloads:
  - videos
  - images
  - audio
  - attachments
  - embedded videos from YouTube, Vimeo and SproutVideo
- Save campaign and content info
- Extensively configurable, e.g.:
  - Download only certain types of media
  - Filter posts by tier, date published, type of media contained
  - Download through proxy server
- Access downloaded content through a web browser

> [!NOTE]  
> Patreon-hosted videos protected by DRM are skipped by default. You can force-download them via "Include -> Protected media", but the downloaded files will remain unplayable due to encryption.

## Installation

Download the Windows x64 `.msi` installer from the [SpeedFix Releases](https://github.com/minimoonleaf/patreon-dl-gui-cw3-speedfix/releases) page. For other operating systems, you may [build the app from source](#running--packaging-the-app-from-source), provided that the required build tools and dependencies are available.

#### FFmpeg

If you are going to download videos, you should also install [FFmpeg](https://www.ffmpeg.org/). This is required for most videos found on Patreon.

#### yt-dlp

If you intend to download embedded videos from Vimeo or SproutVideo, you are recommended to install [yt-dlp](https://github.com/yt-dlp/yt-dlp) and use the bundled helper script. See [Downloading embedded videos using helper script](#downloading-embedded-videos-using-helper-script).

#### Deno

If you intend to download embedded YouTube videos with the built-in YouTube downloader, you are recommended to install [Deno](https://deno.com/). It is used to sandbox code obtained from YouTube / Google servers. Without Deno, the code runs without isolation, increasing the risk of security vulnerabilities such as unauthorized access, data corruption, or malicious behavior.

## Quick start guide

- The UI consists of two major components: the editor and an embedded web browser.
- In the embedded web browser, go to the Patreon page you want to download content from. For content that is accessible only through subscription (which you need to have), ensure you are logged in. Content that is downloadable includes:
  - Posts by a creator
  - A single post
  - Posts in a collection
  - Product purchased from a creator's shop
- When you visit a Patreon page, the app checks whether it contains content that is downloadable. Identified *targets* are shown in the Download section of the editor, along with crucial data such as *cookie* which is required to download patron-only content.
- Once a target is identified, you can configure the options to suit your needs. To get help about an option, select the "Show Help Icons" item in the Help menu.
- To begin downloading the target, click the "play" button in the toolbar. You may also save the configuration to file and open it on another occasion.

### Downloading embedded videos using helper script

`patreon-dl-gui` provides a helper script to facilitate downloading of embedded videos from Vimeo and SproutVideo. The script uses [yt-dlp](https://github.com/yt-dlp/yt-dlp) in the process. The easiest way to set things up would be to:
1. Download a [precompiled binary](https://github.com/yt-dlp/yt-dlp?tab=readme-ov-file#release-files) of `yt-dlp` suitable for your system.
2. Then, in `patreon-dl-gui`, go to "Embeds -> Vimeo" / "Embeds -> SproutVideo".
3. Select "Use helper script" for "Download method".
4. Click the folder icon for "Path to yt-dlp" and select the downloaded binary.

## Browsing downloaded content

Content downloaded by `patreon-dl-gui` v2.2.0 onwards can be accessed through a web browser. To do this, you need to configure and start a web server that serves content from the download destination directory.

In `patreon-dl-gui`, say you've downloaded content to destination directory "C:\My Patreon Downloads". You would then do the following:

- Open the `patreon-dl-gui (Server Console)` app, found in the `patreon-dl-gui` Start Menu folder on Windows or `Utilities` application menu folder on Linux (subject to your Linux distro / desktop environment).
- Click the "Add" button in the toolbar and set the server's properties as follows:
  | Property | Value |
  |------|---------|
  | Name | Anything will do |
  | Data directory | Point to "C:\My Patreon Downloads" |
  | Port | Leave as "Auto" |
- Click the "Add" button. The server is now added and you should see a new entry in the table.
- In the Action column of the added entry, click the "Start" button (play icon).
- If server starts successfully, you should see the message "Running: `URL`" in the Status column. Click the URL to open it in a web browser and begin browsing the downloaded content.
- If you have multiple destination directories, you can add a server for each of them.

## Interoperability with `patreon-dl` CLI

`patreon-dl-gui` is a standalone app that utilizes the `patreon-dl` library to download Patreon content. On the other hand, `patreon-dl` comes with a CLI tool that has the option to read downloader options from a config file.

### Config files

Generally speaking, config files saved in `patreon-dl-gui` can be passed to the `patreon-dl` CLI tool without issue, subject to the following exceptions:

- The "Connect to YouTube account" option found in `patreon-dl-gui` has no equivalent in `patreon-dl` CLI config. You would have to connect to your YouTube account separately through executing `patreon-dl --configure-youtube`.
- Like `patreon-dl-gui`, `patreon-dl` provides helper scripts for downloading embedded videos from Vimeo and SproutVideo, but you would have to set them up yourself in the config (see [example](https://raw.githubusercontent.com/patrickkfkan/patreon-dl/refs/heads/master/example-embed.conf)).

What about the other way round? You should note that the config schema accepted by `patreon-dl` CLI is broader than that for `patreon-dl-gui`. This means, if you have a config file manually created for use by `patreon-dl` CLI, opening it in `patreon-dl-gui` will not necessarily import all the options therein. In particular:

- Multiple targets are not supported.
- For file logger configuration, sections other than `[logger.file.1]` are ignored. `patreon-dl-gui` only supports a single file logger configuration.

When you open a config file, the app will notify you of any omitted or unsupported options.

If you intend to create a config file in `patreon-dl-gui` for use with `patreon-dl` CLI, you should also ensure that the version of `patreon-dl` used by the app matches that of the CLI. See [Version matching](#version-matching).

### Browseability of downloaded content

Through its bundled `patreon-dl-server` executable, `patreon-dl` v3.0.0 onwards can serve content downloaded by `patreon-dl-gui` v2.2.0 and higher.

Through its server console app, `patreon-dl-gui` v2.3.0 onwards can serve content downloaded by `patreon-dl` v3.0.0 and higher.

As is the case with config files, to ensure there will be no compatibility issues, you should match the `patreon-dl-gui` version with the `patreon-dl` version used by it.

### Version matching

The following table lists the version of `patreon-dl` used by each version of `patreon-dl-gui`:

| `patreon-dl-gui` version | `patreon-dl` version used |
|--------------------------|---------------------------|
| v1.0.0 - v2.0.0          | v2.4.1                    |
| v2.1.0                   | v2.4.2                    |
| v2.2.0                   | v3.0.0                    |
| v2.3.0                   | v3.1.0                    |
| v2.4.0                   | v3.2.0                    |
| v2.4.1                   | v3.2.1                    |
| v2.4.2                   | v3.3.1                    |
| v2.5.0                   | v3.4.0                    |
| v2.6.0                   | v3.5.0                    |
| v2.7.0                   | v3.6.0                    |
| v2.7.1 - v2.7.2          | v3.6.1                    |
| v2.8.0                   | v3.7.1                    |
| v2.9.0                   | v3.8.1                    |
| v2.10.0                  | v3.9.0                    |
| v2.10.3-cw3 + SpeedFix v2.5.5 | v3.9.0-speedfix.255 |

## Running / packaging the app from source

Use [Node.js](https://nodejs.org) v22.12.0 or higher. The SpeedFix GUI requires **SpeedFix Core `3.9.0-speedfix.255`**, provided as a local tarball. The `.tgz` is intentionally not committed to this GUI source repository.

Clone and build Core first:

```sh
git clone https://github.com/minimoonleaf/patreon-dl-core-speedfix.git
cd patreon-dl-core-speedfix
git switch speedfix
npm install
npm run build
cd ..
```

Clone the GUI beside the Core folder, create its `vendor` directory, then pack Core into it:

```sh
git clone https://github.com/minimoonleaf/patreon-dl-gui-cw3-speedfix.git
cd patreon-dl-gui-cw3-speedfix
git switch cw3-speedfix
mkdir vendor
cd ../patreon-dl-core-speedfix
npm pack --pack-destination ../patreon-dl-gui-cw3-speedfix/vendor
cd ../patreon-dl-gui-cw3-speedfix
npm install --allow-git=all
npm run start
```

`npm install` must find `vendor/patreon-dl-3.9.0-speedfix.255.tgz` as referenced by `package.json`. If your `vendor` directory already exists, skip the `mkdir vendor` line. Verify the installed Core version with:

```sh
node -p "require('./node_modules/patreon-dl/package.json').version"
```

To start the server console instead, run `npm run start -- -- --server-console`.

To build a Windows installer on a configured Windows development machine with WiX Toolset available:

```sh
npm run make
```

The `out/make/` directory should contain the generated installer when packaging succeeds. Test the installer before publishing a GitHub Release. Linux/macOS packaging requires their corresponding tooling; this fork's published MSI is for Windows x64.

## Upstream changelog (official project)
v2.10.0
- Update `patreon-dl` library to v3.9.0 ([changelog](https://github.com/patrickkfkan/patreon-dl/blob/f35991806e4c14a449b8822e1286282c00c9a91a/CHANGELOG.md)).
- Add support for `media.index` in media filename format ([#60](https://github.com/patrickkfkan/patreon-dl-gui/issues/60)).
- Add support for custom embed downloaders.

v2.9.0
- Update `patreon-dl` library to v3.8.1 ([changelog](https://github.com/patrickkfkan/patreon-dl?tab=readme-ov-file#changelog)).
- Add function to save / reset default settings. Access via `File -> Default Settings` menu.

v2.8.0
- Update `patreon-dl` library to v3.7.1 ([changelog](https://github.com/patrickkfkan/patreon-dl?tab=readme-ov-file#changelog))
- Add more insertable fields to `Output -> Media filenmae format` input
- Add `Include -> Protected media` option
- Fix certain collection-type targets not identified

v2.7.2
- Fix target identification issues with "cw" pages ([#50](https://github.com/patrickkfkan/patreon-dl-gui/issues/50)).
- Vimeo download script: include search params in player URL.

v2.7.1
- Update `patreon-dl` library to v3.6.1 ([changelog](https://github.com/patrickkfkan/patreon-dl?tab=readme-ov-file#changelog))
- Fix Embedly download script error on retrying with alternative URL ([patreon-dl#118](https://github.com/patrickkfkan/patreon-dl/issues/118)).

v2.7.0
- Update `patreon-dl` library to v3.6.0 ([changelog](https://github.com/patrickkfkan/patreon-dl?tab=readme-ov-file#changelog))
- Add SproutVideo support (requires [yt-dlp](https://github.com/yt-dlp/yt-dlp))

v2.6.0
- Update `patreon-dl` library to v3.5.0:
  - Support downloading all products from a creator's shop.
  - Save Collection info when downloading posts; enable browsing posts by collection.
  - Add search functionality in Browse.
  - Save post tags; enable filtering posts by tag.
  - Add `Media thumbnails` option to `Include -> General` tab.
- Centralize URL normalization ([@wallstop](https://github.com/wallstop) - [#36](https://github.com/patrickkfkan/patreon-dl-gui/pull/36))

v2.5.0
- Update `patreon-dl` library to v3.4.0
  - Fix YouTube download error ([#31](https://github.com/patrickkfkan/patreon-dl-gui/issues/31))
  - Fix "no posts found" on "cw" pages ([#30](https://github.com/patrickkfkan/patreon-dl-gui/issues/30))
  - [Full changelog](https://github.com/patrickkfkan/patreon-dl?tab=readme-ov-file#changelog)
- New settings in "Other" tab:
  - Path to Deno
  - Max video resolution

v2.4.2
- Update `patreon-dl` library to v3.3.1
  - Fix YouTube download error ([#28](https://github.com/patrickkfkan/patreon-dl-gui/issues/28))
  - Browse: add next / previous links to post page
  - Some DB optimizations
  - [Full changelog](https://github.com/patrickkfkan/patreon-dl#changelog)
- Fix target identification sometimes fail for custom-domain pages

v2.4.1
- Update `patreon-dl` library to v3.2.1
  - Fix log file path sanitization returning invalid path in some cases on Windows, causing download process to fail right at the beginning.
- Fix target identification error when proxy is used ([#24](https://github.com/patrickkfkan/patreon-dl-gui/issues/24))


v2.4.0
- Update `patreon-dl` library to v3.2.0
- Fix target identification issues with "cw" ([#22](https://github.com/patrickkfkan/patreon-dl-gui/issues/22)) and custom-domain pages
- Change default output directory to `<HOME_DIR>/patreon-dl` ([@Anthonyy232](https://github.com/Anthonyy232) - [#19](https://github.com/patrickkfkan/patreon-dl-gui/issues/19))
- Add "yt-dlp args" input to Vimeo helper script options
- Fix cookies not being fetched completely

v2.3.0
- Update `patreon-dl` library to v3.1.0
- If you got hit by Cloudflare verification loop, this should now be fixed.
- Add web browser settings with:
  - option to clear session data
  - option to set a custom user agent (mainly for debugging purpose - do not use unless you know what you're doing)
- Add reload button to web browser
- On Windows, Start Menu folder should now have the correct name "patreon-dl-gui".
- Add server console for managing servers providing access to downloaded content

v2.2.0
- Update `patreon-dl` library to v3.0.0
- Bug-fixes:
  - "Browser not secure" message / disabled sign-in button for Google account sign-ins
  - Downloading from creators without vanity ([#4](https://github.com/patrickkfkan/patreon-dl-gui/issues/4))
  - "Shell not supported" error when running on macOS ([#6](https://github.com/patrickkfkan/patreon-dl-gui/issues/6))
  - "403 - Forbidden" errors when downloading Patreon-hosted videos ([#8](https://github.com/patrickkfkan/patreon-dl-gui/issues/8))
  - Values inserted through textbox insertion links not persisting ([#9](https://github.com/patrickkfkan/patreon-dl-gui/issues/9))
- Vimeo helper script: fallback to embed URL if player URL fails to download

v2.1.0
- Update `patreon-dl` library to v2.4.2 (mainly fixes YouTube download issues)
- Fix compatibility with Node JS v23 ([#2](https://github.com/patrickkfkan/patreon-dl-gui/issues/2))
- Simplify downloading embedded Vimeo videos through helper script

v2.0.0
- Major UI overhaul: web browser is now embedded into the main window
- Remove the need to download web browser dependency
- One-click to apply proxy settings to web browser session
- Add option to connect to YouTube acount for embedded YouTube videos
- File logger is disabled by default
- Bugfixes

v1.0.0
- Initial release

## License

MIT
