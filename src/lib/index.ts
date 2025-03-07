import { existsSync } from "node:fs";

import { match } from "ts-pattern";

import { ensureExtension } from "../utils";
import { cleanObject } from "../utils/object";
import type { LooseAutocomplete } from "../utils/types";
import { getFinalDownloadUrl } from "./scrappers/downloads";
import { getVariants, RedirectError } from "./scrappers/variants";
import { getVersions } from "./scrappers/versions";
import type { App, AppArch, AppOptions, SpecialAppVersionToken } from "./types";
import {
  extractFileNameFromUrl,
  isAlphaVersion,
  isBetaVersion,
  isSpecialAppVersionToken,
  isStableVersion,
  isUniversalVariant,
  makeRepoUrl,
  makeVariantsUrl,
} from "./utils";

export type APKCDOptions = {
  arch?: AppOptions["arch"];
  dpi?: AppOptions["dpi"];
  minAndroidVersion?: AppOptions["minAndroidVersion"];
  outDir?: AppOptions["outDir"];
};

const DEFAULT_APP_OPTIONS = {
  type: "apk",
  version: "stable",
  arch: "universal",
  dpi: "nodpi",
  overwrite: true,
} satisfies AppOptions;

export type APKCDOptionsWithSuggestions = APKCDOptions & {
  arch?: LooseAutocomplete<AppArch>;
};

export type AppOptionsWithSuggestions = AppOptions & {
  arch?: LooseAutocomplete<AppArch>;
  version?: LooseAutocomplete<SpecialAppVersionToken>;
};
export class APKComboDownloader {
  #options: APKCDOptions;

  constructor(options: APKCDOptionsWithSuggestions = {}) {
    this.#options = cleanObject(options);
  }

  download(app: App, options: AppOptionsWithSuggestions = {}) {
    const o = {
      ...DEFAULT_APP_OPTIONS,
      ...this.#options,
      ...cleanObject(options),
    };
    return APKComboDownloader.download(app, o);
  }

  static async download(app: App, options: AppOptionsWithSuggestions = {}) {
    const o = { ...DEFAULT_APP_OPTIONS, ...cleanObject(options) };

    let variantsUrl: string;
    if (isSpecialAppVersionToken(o.version)) {
      const repoUrl = makeRepoUrl(app);
      const versions = await getVersions(repoUrl);

      const selectedVersion = match(o.version)
        .with("latest", () => versions[0])
        .with("beta", () => versions.find(isBetaVersion))
        .with("alpha", () => versions.find(isAlphaVersion))
        .otherwise(() => versions.find(isStableVersion));

      if (!selectedVersion) {
        throw new Error(`Could not find any suitable ${o.version} version`);
      }

      variantsUrl = selectedVersion.url;
      console.log(`Downloading ${selectedVersion.name}...`);
    } else {
      variantsUrl = makeVariantsUrl(app, o.version);
      console.log(`Downloading ${app.repo} ${o.version}...`);
    }

    if (!variantsUrl) {
      throw new Error("Could not find any suitable version");
    }

    const result = await getVariants(variantsUrl)
      .then(variants => ({ redirected: false as const, variants }))
      .catch(err => {
        if (err instanceof RedirectError) {
          return {
            redirected: true as const,
            url: err.message,
            variants: null,
          };
        }

        throw err;
      });

    let selectedVariant = null;
    if (result.redirected) {
      console.warn(
        "[WARNING]",
        `Only single variant is supported for ${app.org}/${app.repo}`,
      );
      selectedVariant = {
        url: result.url,
      };
    } else {
      let variants = result.variants;

      // filter by arch
      if (o.arch !== "universal" && o.arch !== "noarch") {
        variants = variants.find(v => v.arch.includes(o.arch))
          ? variants.filter(v => v.arch.includes(o.arch))
          : variants.filter(isUniversalVariant); // fallback to universal
      } else {
        variants = variants.filter(isUniversalVariant);
      }

      // filter by dpi
      if (o.dpi !== "*" && o.dpi !== "any") {
        variants = variants.filter(v => v.dpi === o.dpi);
      }

      // filter by minAndroidVersion
      if (o.minAndroidVersion) {
        variants = variants.filter(
          v =>
            parseFloat(v.minAndroidVersion) <= parseFloat(o.minAndroidVersion!),
        );
      }

      // filter by type
      variants = variants.filter(v => v.type === o.type);

      selectedVariant = variants[0];
    }

    if (!selectedVariant) {
      throw new Error("Could not find any suitable variant");
    }

    const finalDownloadUrl = await getFinalDownloadUrl(selectedVariant.url);

    return fetch(finalDownloadUrl).then(async res => {
      const filename = extractFileNameFromUrl(finalDownloadUrl);
      const extension = filename.split(".").pop()!;

      const outDir = o.outDir ?? ".";
      const outFile = ensureExtension(o.outFile ?? filename, extension);
      const dest = `${outDir}/${outFile}`;

      if (!o.overwrite && existsSync(dest)) {
        return { dest, skipped: true as const };
      }

      await Bun.write(dest, res);
      return { dest, skipped: false as const };
    });
  }
}
