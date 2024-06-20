import { useEffect, useState } from "react";
import { type Url } from "../types";
import "./styles/AllUrls.css";
import { CloseIcon, CopyIcon } from "../icons";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "sonner";

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

  function handleClick(){
    toast.success("Link copied!");
  }

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
          <div key={shortUrl} className="relative">
            <a
              onClick={() => handleUpdateClicks(shortUrl)}
              href={realUrl}
              target="_blank"
              rel="noreferrer"
              className="url-container"
            >
              <p className="shorturl">{shortUrl}</p>
              <span className="line"></span>
              <p className="realurl">{realUrl}</p>
            </a>
            {!!urlsOwned[shortUrl] && (
              <button
                className="delete-button"
                onClick={() => handleDelete(shortUrl)}
              >
                <CloseIcon />
              </button>
            )}
            <CopyToClipboard text={`${window.location.origin}/${shortUrl}`}>
              <button onClick={handleClick} className="copy-allurls">
                <CopyIcon />
              </button>
            </CopyToClipboard>

            <p className="clicks">Clicks: {clicks}</p>
          </div>
        );
      })}
    </section>
  );
}
