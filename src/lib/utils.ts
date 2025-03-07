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

//https://apks.55c8fc18511f43b4a8fa7b4011e06de5.r2.cloudflarestorage.com/com.google.android.youtube/20.10.32/1553319360.cfda1e90b2a5cf3508738c5bec9a1d4ad7393169.apks?response-content-disposition=attachment%3B%20filename%3D%22YouTube_20.10.32_apkcombo.app.xapk%22&response-content-type=application%2Fxapk-package-archive&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250307T141759Z&X-Amz-SignedHeaders=host&X-Amz-Expires=14400&X-Amz-Credential=3cb727b4cd4780c410b780ac7caa4da3%2F20250307%2Fauto%2Fs3%2Faws4_request&X-Amz-Signature=378e0829817607971e5c3cae0c10643b2b0c905d6ac9452ffc58a9c4566488a3

export function extractFileNameFromUrl(url: string) {
  const urlobj = new URL(url);

  let u = urlobj.searchParams.get("u");

  if (u) {
    const redirectUrl = new URL(u);
    const contentDisposition = redirectUrl.searchParams.get(
      "response-content-disposition",
    );

    if (contentDisposition) {
      const filename = contentDisposition.split("filename=")[1];
      return JSON.parse(filename);
    }
  }

  const parts = urlobj.pathname.split("/");
  const filename = decodeURIComponent(parts[parts.length - 1]);

  return filename;
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
