export function getFinalDownloadUrl(url: string) {
  return doCheckin().then(checkin => appendCheckinToUrl(url, checkin));
}

export function appendCheckinToUrl(url: string, checkin: string) {
  return [url, checkin].join("&");
}

export async function doCheckin() {
  const res = await fetch("https://apkcombo.app/checkin");
  const data = await res.text();

  return data;
}
