import { type deleteApiResponse } from "../types";

const DELETE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/deleteurl"
    : "http://localhost:3000/api/deleteurl";

export default async function deleteUrl(
  shortUrl: string
): Promise<[Error?, deleteApiResponse?]> {
  try {
    const res = await fetch(DELETE_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: shortUrl }),
    });

    if (!res.ok) return [new Error("Error deleting the url")];

    const data = (await res.json()) as deleteApiResponse;

    const urlsOwned = localStorage.getItem("urlsOwned");

    if (urlsOwned) {
      const urlParsed: Record<string, number> = JSON.parse(urlsOwned);
      delete urlParsed[shortUrl];
      localStorage.setItem("urlsOwned", JSON.stringify(urlParsed));
    }

    return [undefined, data];
  } catch (err) {
    if (err instanceof Error) return [err];
  }

  return [new Error("Unknown error")];
}
