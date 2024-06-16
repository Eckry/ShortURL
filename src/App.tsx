import { useEffect, useState } from "react";
import "./App.css";
import { type addApiResponse, type Url } from "./types.d";
import AllUrls from "./components/AllUrls";
import { toast, Toaster } from "sonner";
import uploadUrl from "./services/uploadUrl";
import deleteUrl from "./services/deleteUrl";

function App() {
  const [allUrls, setAllUrls] = useState<Url[]>([]);
  const [lastUrl, setLastUrl] = useState<addApiResponse | null>(null);

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

    if (target.realurl.value === "" || target.shorturl.value === "") return;

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

      const newLastUrl = { realUrl: data.realUrl, shortUrl: data.shortUrl };

      setAllUrls([newLastUrl, ...newUrls]);

      setLastUrl(data);
      toast(data.message);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/getall");

        if (!res.ok) throw new Error("Error getting the urls");

        const urls = (await res.json()) as Url[];

        if (urls) setAllUrls(urls.reverse());
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
          console.error(err);
        }
      }
    }

    fetchData();
  }, []);

  return (
    <main className="main-container">
      <Toaster />
      <form onSubmit={handleSubmit} className="form-container">
        <label className="form-label">
          Long url
          <input
            name="realurl"
            className="form-input"
            placeholder="https://example.com"
            type="url"
          />
        </label>
        <label className="form-label">
          Short url
          <input
            name="shorturl"
            className="form-input"
            placeholder="example"
            type="text"
          />
        </label>
        <button className="submit-button">Create url!</button>
      </form>
      {!!lastUrl && (
        <section>
          <h2>{lastUrl.message}!</h2>
          <p>{lastUrl.shortUrl} leads you to</p>
          <p>{lastUrl.realUrl}</p>
        </section>
      )}
      <AllUrls handleDelete={handleDelete} urls={allUrls} />
    </main>
  );
}

export default App;
