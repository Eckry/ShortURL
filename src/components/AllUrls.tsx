import { useEffect, useState } from "react";
import { type Url } from "../types";
import "./styles/AllUrls.css";

interface Props {
  urls: Url[];
  handleDelete: (urlToDelete: string) => void;
}

export default function AllUrls({ urls, handleDelete }: Props) {
  const [urlsOwned, setUrlsOwned] = useState<Record<string, string>>({});

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
                onClick={() => handleDelete(shortUrl)}
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
