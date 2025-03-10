import type { Variant } from "./scrappers/variants";
import type { Version } from "./scrappers/versions";
import {
  SPECIAL_APP_VERSION_TOKENS,
  ValidAppArch,
  type App,
  type SpecialAppVersionToken,
} from "./types";

export function withBaseUrl(endpoint: string) {
  if (endpoint.startsWith("https://")) {
    return endpoint;
  }

  if (endpoint.startsWith("/")) {
    return `https://apkcombo.app${endpoint}`;
  }

  return `https://apkcombo.app/${endpoint}`;
}

export function makeRepoUrl({ org, repo }: App) {
  return withBaseUrl(`/${org}/${repo}/old-versions`);
}

export function makeVariantsUrl({ org, repo }: App, version: string) {
  return withBaseUrl(`${org}/${repo}/download/phone-${version}-apk`);
}

export function makeCheckinUrl(url: string, checkin: string) {
  return [withBaseUrl(url), checkin].join("&");
}

export function extractFileNameFromUrl(res: Response) {
  if (res.headers.has("Content-Disposition")) {
    const contentDisposition = res.headers.get("Content-Disposition")!;
    const filename = contentDisposition.split("filename=")[1];
    return JSON.parse(filename);
  }
}

export function isSpecialAppVersionToken<T>(
  token: string,
): token is SpecialAppVersionToken {
  return (SPECIAL_APP_VERSION_TOKENS as readonly string[]).includes(token);
}

export function isUniversalVariant(variant: Variant) {
  return (
    ValidAppArch.every(arch => variant.arch.includes(arch)) ||
    variant.arch.includes("universal") ||
    variant.arch.includes("noarch")
  );
}

export function isAlphaVersion(version: Version) {
  return version.name.toLowerCase().includes("alpha");
}

export function isBetaVersion(version: Version) {
  return version.name.toLowerCase().includes("beta");
}

export function isStableVersion(version: Version) {
  return (
    !version.name.toLowerCase().includes("alpha") &&
    !version.name.toLowerCase().includes("beta")
  );
}
