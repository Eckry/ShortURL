import { Url } from "../types";

export default async function getUrls(): Promise<[Error?, Url[]?]> {
  try {
    const res = await fetch("api/getall");

    if (!res.ok)
      return [new Error(`Error getting the urls: ${res.statusText}`)];

    const urls = (await res.json()) as Url[];

    return [undefined, urls];
  } catch (err) {
    if (err instanceof Error) {
      return [err];
    }
  }

  return [new Error("Unknown error")];
}
