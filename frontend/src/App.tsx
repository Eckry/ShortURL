import { useEffect, useState } from "react";
import "./App.css";
import { type addApiResponse, type Url } from "./types.d";
import AllUrls from "./components/AllUrls";
import { toast, Toaster } from "sonner";
import uploadUrl from "./services/uploadUrl";
import deleteUrl from "./services/deleteUrl";
import updateClicks from "./services/updateClicks";
import getUrls from "./services/getUrls";
import UrlForm from "./components/UrlForm";
import Message from "./components/Message";

function isUrl(url: string) {
  console.log(url);
  try {
    new URL(url);
    return true;
  } catch (err) {
    if (err) return false;
  }
}

function App() {
  const [allUrls, setAllUrls] = useState<Url[]>([]);
  const [lastUrl, setLastUrl] = useState<addApiResponse | null>(null);

  async function handleUpdateClicks(shortUrl: string) {
    const [err] = await updateClicks(shortUrl);

    if (err) {
      toast.error(err.message);
      return;
    }

    const newUrls = allUrls.map((url) => {
      if (url.shortUrl === shortUrl) return { ...url, clicks: url.clicks + 1 };
      return url;
    });

    setAllUrls(newUrls);
  }

  async function handleDelete(urlToDelete: string) {
    const [err, data] = await deleteUrl(urlToDelete);

    if (err) {
      toast.error(err.message);
      return;
    }

    if (data) {
      toast(data.message);
    }

    const newUrls = allUrls.filter((url) => {
      return url.shortUrl !== urlToDelete;
    });

    setAllUrls(newUrls);
    if (urlToDelete === lastUrl?.shortUrl) setLastUrl(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.currentTarget;

    if (!isUrl(target.realurl.value)) {
      toast.warning("You must give a valid URL");
      return;
    }

    if (target.shorturl.value.length < 3) {
      toast.warning("Your url name must have at least 3 characters");
      return;
    }

    const body = {
      url: target.realurl.value,
      name: target.shorturl.value,
    };

    const [err, data] = await uploadUrl(body);

    if (err) {
      toast.error(err.message);
      return;
    }

    if (data) {
      const newUrls = allUrls.filter(({ shortUrl }) => {
        return shortUrl !== data.shortUrl;
      });

      const newLastUrl = {
        realUrl: data.realUrl,
        shortUrl: data.shortUrl,
        clicks: data.clicks,
      };

      setAllUrls([newLastUrl, ...newUrls]);

      setLastUrl(data);
      toast(data.message);

      window.navigator.clipboard.writeText(data.shortUrl);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const [err, urls] = await getUrls();

      if (err) {
        toast.error(err.message);
        return;
      }

      if (urls) setAllUrls(urls);
    }

    fetchData();
  }, []);

  return (
    <main className="main-container">
      <Toaster />
      <UrlForm handleSubmit={handleSubmit} />
      {!!lastUrl && <Message lastUrl={lastUrl} />}
      <AllUrls
        handleUpdateClicks={handleUpdateClicks}
        handleDelete={handleDelete}
        urls={allUrls}
      />
    </main>
  );
}

export default App;