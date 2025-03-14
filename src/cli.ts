import { existsSync } from "fs";

import yargs from "yargs";

import { version } from "../package.json";
import {
  APKComboDownloader,
  type APKCDOptions,
  type App,
  type AppOptions,
} from "./index";
import { readJsonFile } from "./utils/filesystem";

console.log("\n", `*** APKCD (APKCombo Downloader) v${version} ***`, "\n");

yargs(process.argv.slice(2))
  .command(
    `$0 [filepath]`,
    `download multiple apps using json file`,
    yargs => {
      return yargs.positional("filepath", {
        type: "string",
        describe: "JSON file path",
        default: "./apps.json",
      });
    },
    async args => {
      if (!existsSync(args.filepath)) {
        console.log("Could not read config file", args.filepath);
        process.exit(1);
      }

      const config = await readJsonFile<{
        options: APKCDOptions;
        apps: (App & AppOptions)[];
      }>(args.filepath).catch(err => {
        console.log("Could not read config file", err);
        process.exit(1);
      });

      const apkmd = new APKComboDownloader(config.options);

      for (const appWithOptions of config.apps) {
        const { org, repo, ...options } = appWithOptions;
        await apkmd
          .download({ org, repo }, options)
          .then(
            ({ dest, skipped }) => {
              if (skipped) {
                console.log(`Skipped ${org}/${repo}`);
                console.log(`Already exists at ${dest}`);
              } else {
                console.log(`Downloaded to ${dest}`);
              }
            },
            e => {
              console.log(`Unable to download ${org}/${repo}`);
              console.log(e.message);
            },
          )
          .finally(() => {
            console.log();
          });
      }
    },
  )
  .command(
    `download <org> <repo>`,
    `download single app using cli`,
    yargs => {
      return yargs
        .positional("org", {
          type: "string",
          describe: "Org name",
        })
        .positional("repo", {
          type: "string",
          describe: "Repo name",
        })
        .option("version", {
          type: "string",
          describe: "Version",
          alias: "v",
        })
        .option("arch", {
          type: "string",
          describe: "Architecture",
          alias: "a",
        })
        .option("dpi", {
          type: "string",
          describe: "DPI",
          alias: "d",
        })
        .option("type", {
          type: "string",
          describe: "Type",
          alias: "t",
          choices: ["apk", "bundle"],
        })
        .option("minandroidversion", {
          type: "string",
          describe: "Minimum Android version",
          alias: "m",
        })
        .option("outfile", {
          type: "string",
          describe: "Output file",
          alias: "o",
        })
        .option("outdir", {
          type: "string",
          describe: "Output directory",
        })
        .option("overwrite", {
          type: "boolean",
          describe: "Overwrite existing files",
          default: true,
        });
    },
    async argv => {
      const app = {
        org: argv.org!,
        repo: argv.repo!,
      };
      const options = {
        version: argv.version,
        arch: argv.arch,
        dpi: argv.dpi,
        type: argv.type as AppOptions["type"],
        minAndroidVersion: argv.minandroidversion,
        outFile: argv.outfile,
        outDir: argv.outdir,
        overwrite: argv.overwrite,
      };

      await APKComboDownloader.download(app, options).then(
        ({ dest, skipped }) => {
          if (skipped) {
            console.log(`Skipped ${app.org}/${app.repo}`);
            console.log(`Already exists at ${dest}`);
          } else {
            console.log(`Downloaded to ${dest}`);
          }
        },
        err => {
          console.error(err);
        },
      );
    },
  )
  .version(false)
  .help()
  .parse();
