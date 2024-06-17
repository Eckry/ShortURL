import { useEffect, useState } from "react";
import { type Url } from "../types";
import "./styles/AllUrls.css";

interface Props {
  urls: Url[];
  handleDelete: (urlToDelete: string) => void;
  handleUpdateClicks: (shortUrl: string) => void;
}

export default function AllUrls({
  urls,
  handleDelete,
  handleUpdateClicks,
}: Props) {
  const [urlsOwned, setUrlsOwned] = useState<Record<string, string>>({});

  useEffect(() => {
    const hasUrlsOwned = localStorage.getItem("urlsOwned");
    if (hasUrlsOwned) {
      setUrlsOwned(JSON.parse(hasUrlsOwned));
    }
  }, [urls]);

  return (
    <section className="urls-section">
      {urls.map(({ shortUrl, realUrl, clicks }) => {
        return (
          <div key={shortUrl} className="relative go-up">
            <a
              onClick={() => handleUpdateClicks(shortUrl)}
              href={realUrl}
              target="_blank"
              rel="noreferrer"
              className="url-container"
            >
              <p>{shortUrl}</p>
              <p className="realurl">{realUrl}</p>
            </a>
            {!!urlsOwned[shortUrl] && (
              <button
                className="delete-button"
                onClick={() => handleDelete(shortUrl)}
              >
                X
              </button>
            )}
            <p>{clicks}</p>
          </div>
        );
      })}
    </section>
  );
}
