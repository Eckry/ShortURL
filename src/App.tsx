import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { type addApiResponse, type Url } from "./types";
import AllUrls from "./components/AllUrls";
import { toast, Toaster } from "sonner";
import uploadUrl from "./services/uploadUrl";
import deleteUrl from "./services/deleteUrl";
import updateClicks from "./services/updateClicks";
import getUrls from "./services/getUrls";
import UrlForm from "./components/UrlForm";
import Message from "./components/Message";
import Loading from "./components/Loading";
import Searcher from "./components/Searcher";
import NoUrlsFound from "./components/NoUrlsFound";
import Example from "./components/Example";
import { MIN_NAME_LENGTH, URLS_PER_PAGE } from "./consts.d";
import { GitHubIcon } from "./icons";

function isUrl(url: string) {
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
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(() => {
    const params = new URL(window.location.href).searchParams;
    const query = params.get("search");
    if (query) return query;
    return "";
  });

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

    if (target.shorturl.value.length < MIN_NAME_LENGTH) {
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

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const [err, urls] = await getUrls();

      if (err) {
        setAllUrls([]);
        return setIsLoading(false);
      }

      if (urls) setAllUrls(urls);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const newPathName =
      search === "" ? window.location.pathname : `?search=${search}`;

    window.history.replaceState({}, "", newPathName);
  }, [search]);

  const filteredUrls = useMemo(
    () =>
      allUrls.filter((url) => {
        const { realUrl, shortUrl } = url;
        return realUrl.includes(search) || shortUrl.includes(search);
      }),
    [search, allUrls]
  );

  const noUrlsFound = search === "" && allUrls.length === 0 && !isLoading;
  const hasMorePages = filteredUrls.length / URLS_PER_PAGE > page;

  const newUrls = filteredUrls.slice(0, page * URLS_PER_PAGE);

  return (
    <>
      <Toaster />
      <main className="main-container">
        <header className="header-container">
          <h1>Urlsito</h1>
          <h2 className="header-h2">A url shortener</h2>
        </header>
        <UrlForm handleSubmit={handleSubmit} />
        {!!lastUrl && <Message lastUrl={lastUrl} />}
        <Example />
        <h1 className="urls-title">Urls created so far</h1>
        <Searcher onChange={handleOnChange} search={search} />
        {noUrlsFound && <NoUrlsFound />}
        {!isLoading ? (
          <AllUrls
            handleUpdateClicks={handleUpdateClicks}
            handleDelete={handleDelete}
            urls={newUrls}
          />
        ) : (
          <Loading />
        )}
        {hasMorePages && (
          <button
            className="show-more"
            onClick={() => setPage((prevPage) => prevPage + 1)}
          >
            Show more
          </button>
        )}
      </main>
      <a
        href="https://github.com/Eckry/ShortURL"
        target="_blank"
        className="github"
      >
        <GitHubIcon />
      </a>
    </>
  );
}

export default App;
