import { useEffect, useState } from "react";
import { type Url } from "../types";
import "./styles/AllUrls.css";

interface Props {
  urls: Url[];
}

export default function AllUrls({ urls }: Props) {
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
          <a key={shortUrl} href={realUrl} className="url-container">
            <p>{shortUrl}</p>
            <p className="realurl">{realUrl}</p>
            {!!urlsOwned[shortUrl] && <button>HELLO</button>}
          </a>
        );
      })}
    </section>
  );
}
