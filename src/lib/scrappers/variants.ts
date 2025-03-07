import { load } from "cheerio";
import { match } from "ts-pattern";

import { isNotNull } from "../../utils/typescript";
import { SUPPORTED_APP_TYPES } from "../types";
import { withBaseUrl } from "../utils";

export class RedirectError extends Error {}

export function getVariants(variantsPageUrl: string) {
  return fetch(variantsPageUrl)
    .then(res => {
      if (res.redirected) {
        throw new RedirectError(res.url);
      }

      return res.text();
    })
    .then(extractVariants);
}

export function extractVariants(variantsPageHtml: string) {
  const $ = load(variantsPageHtml);
  const table = $("#best-variant-tab");

  const rows = table.children().toArray();

  const variants = rows.map(row => {
    const $variant = $(row);

    const version = $variant.find(".vername").text();

    const type = match($variant.find("span").text().trim())
      .when(
        t => t.includes("APK"),
        () => SUPPORTED_APP_TYPES.apk,
      )
      .when(
        t => t.includes("BUNDLE"),
        () => SUPPORTED_APP_TYPES.bundle,
      )
      .otherwise(() => "unknown");

    const arch = $variant.find(".blur").text().trim().split(", ");
    const minAndroidVersion = $variant.find(".spec").eq(1).text();
    const dpi = $variant.find(".spec").eq(2).text().trim();
    const url = $variant.find("a").attr("href");

    if (!url) {
      return null;
    }

    return {
      version,
      type,
      arch,
      minAndroidVersion,
      dpi,
      url: withBaseUrl(url),
    };
  });

  return variants.filter(isNotNull);
}

export type Variant = Awaited<ReturnType<typeof extractVariants>>[number];
