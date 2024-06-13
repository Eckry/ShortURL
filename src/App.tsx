import { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUrl(event.target.value);
  }

  async function handleClick() {
    const body = { url: url, name: "back" };
    const result = await fetch("http://localhost:3000/api/addurl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await result.json();
    console.log(data);
  }

  return (
    <main>
      <input type="text" onChange={handleChange} value={url} />
      <input type="text" />
      <button onClick={handleClick}>SUBMIT</button>
    </main>
  );
}

export default App;
