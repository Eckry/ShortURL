import { type addApiResponse } from "../types";

interface Body {
  url: string;
  name: string;
}

const ADD_URL =
  process.env.NODE_ENV === "production"
    ? "/api/addurl"
    : "http://localhost:3000/api/addurl";

export default async function uploadUrl(
  body: Body
): Promise<[Error?, addApiResponse?]> {
  try {
    const res = await fetch(ADD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok)
      return [new Error(`Error uploading the url: ${res.statusText}`)];

    const data = (await res.json()) as addApiResponse;

    if (!data.shortUrl) return [new Error("Something ocurred")];
    if (!data.realUrl) return [new Error("Something ocurred")];

    const urlAlreadyExists = data.message === "Name already exists";

    if (urlAlreadyExists) return [undefined, data];

    const urlsOwned = localStorage.getItem("urlsOwned");

    if (urlsOwned) {
      const urlsParsed = JSON.parse(urlsOwned);
      localStorage.setItem(
        "urlsOwned",
        JSON.stringify({ ...urlsParsed, [body.name]: 1 })
      );
    } else {
      localStorage.setItem("urlsOwned", JSON.stringify({ [body.name]: 1 }));
    }

    return [undefined, data];
  } catch (err) {
    if (err instanceof Error) return [err];
  }

  return [new Error("Unknown errors")];
}
