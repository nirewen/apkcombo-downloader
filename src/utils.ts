import type { App } from "./lib/types";

export function cleanObject<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T;
}

export function makeRepoUrl({ org, repo }: App) {
  return `https://apkcombo.app/${org}/${repo}/download/apk`;
}

export function extractFileNameFromUrl(url: string) {
  const urlobj = new URL(url);
  const parts = urlobj.pathname.split("/");
  const filename = decodeURIComponent(parts[parts.length - 1]);
  return filename;
}

export function ensureExtension(path: string, extension: string) {
  if (!extension.startsWith(".")) {
    extension = `.${extension}`;
  }

  if (!path.endsWith(extension)) {
    return `${path}${extension}`;
  }

  return path;
}
