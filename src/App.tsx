import { useEffect, useState } from "react";
import "./App.css";
import { type Url } from "./types.d";
import AllUrls from "./components/AllUrls";
import { toast, Toaster } from "sonner";
import uploadUrl from "./services/uploadUrl";

function App() {
  const [allUrls, setAllUrls] = useState<Url[]>([]);

  function deleteUrl(urlToDelete: string) {
    const newUrls = allUrls.filter((url) => {
      return url.shortUrl !== urlToDelete;
    });

    setAllUrls(newUrls);
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
    }

    if (data) {
      const newUrls = allUrls.filter(({ shortUrl }) => {
        return shortUrl !== data.shortUrl;
      });

      setAllUrls([
        { realUrl: data.realUrl, shortUrl: data.shortUrl },
        ...newUrls,
      ]);

      toast(data.message);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/getall");
        const urls = (await res.json()) as Url[];
        setAllUrls(urls);
      } catch (err) {
        console.error(err);
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
            type="text"
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
      <AllUrls deleteUrl={deleteUrl} urls={allUrls} />
    </main>
  );
}

export default App;
