import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export function readJsonFile<T = any>(path: string): Promise<T> {
  return readFile(resolve(path), "utf-8").then(JSON.parse);
}
