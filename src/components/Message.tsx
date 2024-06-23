import "./styles/Message.css";
import CopyToClipboard from "react-copy-to-clipboard";
import { addApiResponse } from "../types";
import { ArrowIcon, CopyIcon } from "../icons";
import { toast } from "sonner";

interface Props {
  lastUrl: addApiResponse;
}

export default function Message({ lastUrl }: Props) {
  function handleClick() {
    toast.success("Link copied!");
  }

  return (
    <section className="message-section">
      <h2 className="message-title">{lastUrl.message}!</h2>
      <p className="message-realurl">{lastUrl.realUrl}</p>
      <ArrowIcon />
      <CopyToClipboard text={`${window.location.origin}/${lastUrl.shortUrl}`}>
        <p onClick={handleClick} className="message-shorturl">
          {window.location.origin}/{lastUrl.shortUrl}
        </p>
      </CopyToClipboard>
      <CopyToClipboard text={`${window.location.origin}/${lastUrl.shortUrl}`}>
        <button onClick={handleClick} className="copy">
          <CopyIcon />
        </button>
      </CopyToClipboard>
    </section>
  );
}
