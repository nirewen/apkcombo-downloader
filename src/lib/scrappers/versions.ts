import { load } from "cheerio";

import { isNotNull } from "../../utils/typescript";
import { withBaseUrl } from "../utils";

export function getVersions(repoPageUrl: string) {
  return fetch(repoPageUrl)
    .then(res => res.text())
    .then(extractVersions);
}

export function extractVersions(versionsPageHtml: string) {
  const $ = load(versionsPageHtml);
  const table = $(".list-versions");

  const rows = table.children().toArray();

  const versions = rows.map(row => {
    const $row = $(row);

    const name = $row.find(".vername").text();

    const url = $row.find("a").attr("href");

    if (!name || !url) {
      return null;
    }

    return { name, url: withBaseUrl(url) };
  });

  return versions.filter(isNotNull);
}

export type Version = ReturnType<typeof extractVersions>[number];
