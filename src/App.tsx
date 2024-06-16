import { useEffect, useState } from "react";
import "./App.css";
import { type Url } from "./types.d";
import AllUrls from "./components/AllUrls";

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
    <main className="main-container">
      <form className="form-container">
        <label className="form-label">
          Long url
          <input
            className="form-input"
            placeholder="https://example.com"
            type="text"
          />
        </label>
        <label className="form-label">
          Short url
          <input className="form-input" placeholder="example" type="text" />
        </label>
        <button className="submit-button">Create url!</button>
      </form>
      <AllUrls urls={allUrls} />
    </main>
  );
}

export default App;
