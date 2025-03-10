# APKCD //APK Combo Downloader

APKCD is a CLI tool that allows you to download APKs from APKCombo.app. This repo also provides a npm package [@nirewen/apkcombo-downloader](https://npm.im/@nirewen/apkcombo-downloader) that allows you to download APKs from APKMirror programatically.

This repo and project is based on [APKMD](https://github.com/tanishqmanuja/apkmirror-downloader/) by [tanishqmanuja](https://github.com/tanishqmanuja). If you want more download options, consider using this tool.

# Why a fork with a different APK provider?

APKMirror does have more APKs but recently has added Cloudflare protection which makes it harder to scrape.\
APKCombo is a good alternative with a lot of APKs and no Cloudflare protection.

The API and usage is the same as APKMD. You can check below for documentation on using the API and CLI.

## 🚀 Install

Using `npm`
```bash
npm install @nirewen/apkcombo-downloader
```

Using `bun`
```bash
bun add @nirewen/apkcombo-downloader
```

Or use any other package manager like `yarn` or `pnpm`

## 📃 Usage

```ts
import { APKComboDownloader } from "@nirewen/apkcombo-downloader";

const apkcd = new APKComboDownloader(
  { outDir: "./downloads" } // <-- 🟠 APKCDOptions (optional)
);

apkcd.download(
  { org: "youtube", repo: "com.google.android.youtube" }, // <-- App (required)
  { type: "apk" } // <-- 🟣 AppOptions (optional), will be merged with APKCDOptions
);

// OR

APKComboDownloader.download({ org: "youtube", repo: "com.google.android.youtube" });
```

🟠 **APKCDOptions Interface**
- arch: Optional. The architecture of the application. For example, arm64-v8a, armeabi-v7a, etc.
- dpi: Optional. The screen density of the application. For example, 240dpi, 320dpi, 480dpi, etc.
- minAndroidVersion: Optional. The minimum Android version that the application is compatible with.
- outDir: Optional. The output directory where the application files will be stored.

🟣 **AppOptions Interface**
- version: Optional. The version of the application.
- arch: Optional, DEFAULT: "universal". The architecture of the application. For example, arm64-v8a, armeabi-v7a, etc.
- dpi: Optional, DEFAULT: "nodpi". The screen density of the application. For example, 240dpi, 320dpi, 480dpi, etc.
- type: Optional, DEFAULT: "apk". The type of the application. Supported types are "apk" and "bundle". 
- minAndroidVersion: Optional. The minimum Android version that the application is compatible with.
- outFile: Optional. The name of the output file where the application will be saved.
- outDir: Optional. The output directory where the application files will be stored.

`AppOptions` will be merged automatically with `APKCDOptions` when download function is called.

## ⚡ CLI

CLI can be downloaded from [releases](https://github.com/nirewen/apkcombo-downloader/releases/latest) section.

Download for your platform and architecture. Rename the file to apkcd for convenience.

Usage can be found using the following command

```bash
apkcd --help
```

For downloading multiple apks use apps.json file

```bash
apkcd apps.json
```

```json
{
  "options": {
    "arch": "arm64-v8a",
    "outDir": "downloads"
  },
  "apps": [
    {
      "org": "youtube-music",
      "repo": "com.google.android.apps.youtube.music",
      "outFile": "ytm"
    },
    {
      "org": "youtube",
      "repo": "com.google.android.youtube",
      "outFile": "yt",
      "version": "18.40.34"
    }
  ]
}
```

## 🐱 Show your support

Give a ⭐️ if this project helped you!

## 👨‍💻 Projects to checkout

1. 📦 [**APKMD**](https://github.com/tanishqmanuja/apkmirror-downloader/) by [**tanishqmanuja**](https://github.com/tanishqmanuja) \
   Download apps from APKMirror with ease. (Forked to create this project)

2. 📦 [**gh-apkmirror-dl**](https://github.com/Yakov5776/gh-apkmirror-dl) by [**Yakov**](https://github.com/Yakov5776) \
   A GitHub Action to download APKs from Apkmirror

3. 📦 [**revanced-auto-patcher**](https://github.com/Sp3EdeR/revanced-auto-patcher) by [**Sp3EdeR**](https://github.com/Sp3EdeR) \
   A Python script to patch apps using Revanced or Revanced Extended

4. 📦 [**APKEditor**](https://github.com/REAndroid/APKEditor) by [**REAndroid**](https://github.com/REAndroid)\
   A Java tool to edit APKs, convenient when downloading XAPKs from APKCombo

## 💀 Disclaimer

THIS PROJECT IS NOT ASSOCIATED OR ENDORSED BY APKMIRROR. The project is provided "as is" without warranty of any kind, either express or implied. Use at your own risk.

<!-- Shields -->

[ci-status-shield]: https://img.shields.io/github/actions/workflow/status/nirewen/apkcombo-downloader/ci.yaml?branch=main&style=for-the-badge&label=ci
[downloads-shield]: https://img.shields.io/github/downloads/nirewen/apkcombo-downloader/total?style=for-the-badge&logo=github
[downloads-url]: https://github.com/nirewen/apkcombo-downloader/releases/latest
[language-shield]: https://img.shields.io/github/languages/top/nirewen/apkcombo-downloader?style=for-the-badge
[language-url]: https://www.typescriptlang.org/
[license-shield]: https://img.shields.io/github/license/nirewen/apkcombo-downloader?style=for-the-badge
[license-url]: https://github.com/nirewen/apkcombo-downloader/blob/main/LICENSE.md
[npm-shield]: https://img.shields.io/npm/v/apkmirror-downloader?style=for-the-badge
[npm-url]: https://www.npmjs.com/package/apkmirror-downloader
