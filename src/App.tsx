import { useEffect, useState } from "react";
import "./App.css";

interface Url {
  realUrl: string;
  shortUrl: string;
}

function App() {
  const [allUrls, setAllUrls] = useState<Url[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/getall")
      .then((res) => res.json())
      .then((urls) => {
        setAllUrls(urls);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <main>
      <form>
        <input type="text" />
        <input type="text" />
        <button>SUBMIT</button>
      </form>
      {allUrls.map(({ realUrl, shortUrl }) => {
        return (
          <div>
            {realUrl} - {shortUrl}
          </div>
        );
      })}
    </main>
  );
}

export default App;
