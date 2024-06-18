import CopyToClipboard from "react-copy-to-clipboard";
import { addApiResponse } from "../types.d";

interface Props {
  lastUrl: addApiResponse;
}

export default function Message({ lastUrl }: Props) {
  return (
    <section>
      <h2>{lastUrl.message}!</h2>
      <p>{lastUrl.shortUrl} leads you to</p>
      <CopyToClipboard text={lastUrl.realUrl}>
        <p>{lastUrl.realUrl}</p>
      </CopyToClipboard>
      <CopyToClipboard text={lastUrl.realUrl}>
        <button>Copy</button>
      </CopyToClipboard>
    </section>
  );
}
