import { CopyIcon } from "../icons";
import "./styles/Loading.css";

function Card() {
  return (
    <div className="relative">
      <a className="url-container-loading">
        <p className="shorturl-loading">X</p>
        <span className="line-loading"></span>
        <p className="realurl-loading">X</p>
      </a>

      <button className="copy-allurls-loading">
        <CopyIcon />
      </button>

      <p className="clicks-loading">Clicks: 1</p>
    </div>
  );
}

export default function Loading() {
  return (
    <section className="urls-section">
      {Array.from({ length: 10 }).map(() => {
        return <Card />;
      })}
    </section>
  );
}
