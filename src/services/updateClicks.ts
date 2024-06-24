const UPDATE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/updateclicks"
    : "http://localhost:3000/api/updateclicks";

export default async function updateClicks(
  shortUrl: string
): Promise<[Error?, boolean?]> {
  try {
    const res = await fetch(UPDATE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortUrl }),
    });

    if (!res.ok) return [new Error("Error updating the clicks")];

    return [undefined, true];
  } catch (err) {
    if (err instanceof Error) return [err];
  }

  return [new Error("Unknown error")];
}
