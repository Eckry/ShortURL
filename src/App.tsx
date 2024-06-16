import { useEffect, useState } from "react";
import "./App.css";
import { addApiResponse, type Url } from "./types.d";
import AllUrls from "./components/AllUrls";
import { toast, Toaster } from "sonner";

function App() {
  const [allUrls, setAllUrls] = useState<Url[]>([]);

  function deleteUrl(urlToDelete: string) {
    const newUrls = allUrls.filter((url) => {
      return url.shortUrl !== urlToDelete;
    });

    setAllUrls(newUrls);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!e) return;
    e.preventDefault();

    const target = e.currentTarget;

    if (target.realurl.value === "" || target.shorturl.value === "") return;

    const body = {
      url: target.realurl.value,
      name: target.shorturl.value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/addurl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as addApiResponse;

      if (!data.shortUrl) throw new Error("Something ocurred");
      if (!data.realUrl) throw new Error("Something ocurred");

      const newUrls = allUrls.filter(({ shortUrl }) => {
        return shortUrl !== data.shortUrl;
      });

      setAllUrls([
        { realUrl: data.realUrl, shortUrl: data.shortUrl },
        ...newUrls,
      ]);
      toast(data.message);
    } catch (err) {
      console.log(err);
    } finally {
      const urlsOwned = localStorage.getItem("urlsOwned");
      if (urlsOwned) {
        const urlsParsed = JSON.parse(urlsOwned);
        localStorage.setItem(
          "urlsOwned",
          JSON.stringify({ ...urlsParsed, [body.name]: 1 })
        );
      } else {
        localStorage.setItem("urlsOwned", JSON.stringify({ [body.name]: 1 }));
      }
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
