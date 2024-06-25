import express from "express";
import cors from "cors";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import serverless from "serverless-http";

dotenv.config();

export const turso = createClient({
  url: process.env.VITE_TURSO_URL ?? "",
  authToken: process.env.VITE_AUTH_TOKEN ?? "",
});

const app = express();
app.use(cors());
app.use(express.json());

function isUrl(string: string) {
  try {
    return Boolean(new URL(string));
  } catch (err) {
    return false;
  }
}

//////////////////////////* POST *//////////////////////////

app.post("/api/addurl", async (req, res) => {
  const { url, name }: { url: string; name: string } = req.body;

  if (!isUrl(url)) {
    res.status(400).send({ message: "Url sent is not an Url" });
    return;
  }

  const result = await turso.execute({
    sql: "SELECT shortUrl, realUrl, clicks FROM urls WHERE shortUrl = :name",
    args: { name: name },
  });

  if (result.rows.length > 0) {
    const [{ shortUrl, realUrl, clicks }] = result.rows;
    res
      .status(200)
      .send({ message: "That name already exists", shortUrl, realUrl, clicks });
    return;
  }

  await turso.execute({
    sql: "INSERT INTO urls (shortUrl, realUrl) VALUES (:shortUrl, :realUrl)",
    args: { shortUrl: name, realUrl: url },
  });

  res.status(200).send({
    message: "Url successfully created",
    shortUrl: name,
    realUrl: url,
    clicks: 0,
  });
});

//////////////////////////* DELETE *//////////////////////////

app.delete("/api/deleteurl", async (req, res) => {
  const { url }: { url: string } = req.body;

  const result = await turso.execute({
    sql: "DELETE FROM urls WHERE shorturl = :url",
    args: { url: url },
  });

  const wasUrlDeleted = result.rowsAffected === 1;

  if (wasUrlDeleted) {
    res.status(200).send({ message: "Url was successfully deleted" });
    return;
  }

  res.status(404).send({ message: "Url not found" });
});

//////////////////////////* PUT *//////////////////////////

app.put("/api/updateclicks", async (req, res) => {
  const { shortUrl } = req.body;

  const result = await turso.execute({
    sql: "UPDATE urls SET clicks = clicks + 1 WHERE :shortUrl = shortUrl",
    args: { shortUrl },
  });

  if (result.rowsAffected === 0) {
    return res.status(404).send({ message: "That url doesn't exist" });
  }

  return res.status(200).send({ message: "Clicks updated" });
});

//////////////////////////* GET *//////////////////////////

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const result = await turso.execute({
    sql: "SELECT realUrl FROM urls WHERE shortUrl = :name",
    args: { name: shortUrl },
  });

  if (result.rows.length === 0) {
    res.status(404).send({ message: "This url hasn't been created yet" });
    return;
  }

  const [{ realUrl }] = result.rows;

  await turso.execute({
    sql: "UPDATE urls SET clicks = clicks + 1 WHERE :shortUrl = shortUrl",
    args: { shortUrl },
  });

  if (typeof realUrl === "string") return res.redirect(realUrl);
  res.status(500).send({ message: "Something went wrong" });
});

app.get("/api/getall", async (_, res) => {
  const result = await turso.execute("SELECT * FROM urls");

  if (result.rows.length === 0) {
    res.status(404).send({ message: "No urls found" });
    return;
  }

  res.status(200).send(result.rows);
});

//app.use(express.static("../../dist"));

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});

export const handler = serverless(app);
