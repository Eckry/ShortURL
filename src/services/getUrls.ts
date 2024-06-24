import { Url } from "../types";

const GET_URL =
  process.env.NODE_ENV === "production"
    ? "/api/getall"
    : "http://localhost:3000/api/getall";

export default async function getUrls(): Promise<[Error?, Url[]?]> {
  try {
    const res = await fetch(GET_URL);

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
