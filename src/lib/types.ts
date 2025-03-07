export const SUPPORTED_APP_TYPES = {
  apk: "apk",
  bundle: "bundle",
} as const;

export const SPECIAL_APP_VERSION_TOKENS = [
  "latest",
  "stable",
  "beta",
  "alpha",
] as const;

export type SpecialAppVersionToken =
  (typeof SPECIAL_APP_VERSION_TOKENS)[number];

export type AppType =
  (typeof SUPPORTED_APP_TYPES)[keyof typeof SUPPORTED_APP_TYPES];

export const ValidAppArch = [
  "armeabi-v7a",
  "arm64-v8a",
  "x86",
  "x86_64",
] as const;
export type AppArch = "universal" | "noarch" | (typeof ValidAppArch)[number];

export type App = {
  org: string;
  repo: string;
};

export type AppOptions = {
  version?: string;
  arch?: string;
  dpi?: string;
  type?: AppType;
  minAndroidVersion?: string;
  outFile?: string;
  outDir?: string;
  overwrite?: boolean;
};
