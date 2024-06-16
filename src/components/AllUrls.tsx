import { type Url } from "../types";
import "./styles/AllUrls.css";

interface Props {
  urls: Url[];
}

export default function AllUrls({ urls }: Props) {
  return (
    <section className="urls-section">
      {urls.map(({ shortUrl, realUrl }) => {
        return (
          <a key={shortUrl} href={realUrl} className="url-container">
            <p>{shortUrl}</p>
            <p>{realUrl}</p>
          </a>
        );
      })}
    </section>
  );
}
