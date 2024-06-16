import { useEffect, useState } from "react";
import { type deleteApiResponse, type Url } from "../types";
import { toast } from "sonner";
import "./styles/AllUrls.css";

interface Props {
  urls: Url[];
  deleteUrl: (urlToDelete: string) => void;
}

export default function AllUrls({ urls, deleteUrl }: Props) {
  const [urlsOwned, setUrlsOwned] = useState<Record<string, string>>({});

  async function deleteUrlApi(shortUrl: string) {
    try {
      const res = await fetch("http://localhost:3000/api/deleteurl", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: shortUrl }),
      });

      if (!res.ok) throw new Error("Something ocurred");

      const data = (await res.json()) as deleteApiResponse;
      deleteUrl(shortUrl);
      toast(data.message);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const hasUrlsOwned = localStorage.getItem("urlsOwned");
    if (hasUrlsOwned) {
      setUrlsOwned(JSON.parse(hasUrlsOwned));
    }
  }, [urls]);

  return (
    <section className="urls-section">
      {urls.map(({ shortUrl, realUrl }) => {
        return (
          <div className="relative go-up">
            <a key={shortUrl} href={realUrl} className="url-container">
              <p>{shortUrl}</p>
              <p className="realurl">{realUrl}</p>
            </a>
            {!!urlsOwned[shortUrl] && (
              <button
                className="delete-button"
                onClick={() => deleteUrlApi(shortUrl)}
              >
                X
              </button>
            )}
          </div>
        );
      })}
    </section>
  );
}
