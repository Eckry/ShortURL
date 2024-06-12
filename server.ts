import express from "express";
import cors from "cors";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

export const turso = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_AUTH_TOKEN,
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/addurl", async (req, res) => {
  const { url, name }: { url: string; name: string } = req.body;

  const result = await turso.execute({
    sql: "SELECT shortUrl FROM urls WHERE shortUrl = :name",
    args: { name: name },
  });

  if (result.rows.length > 0) {
    const [{ shortUrl }] = result.rows;
    res.status(200).send({ message: "Url already exists", shortUrl });
    return;
  }

  await turso.execute({
    sql: "INSERT INTO urls (shortUrl, realUrl) VALUES (:shortUrl, :realUrl)",
    args: { shortUrl: name, realUrl: url },
  });

  res.status(200).send({ message: "Url successfully added", url: name });
});

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
  res
    .status(200)
    .send({ message: "Url successfully found, redirecting...", url: realUrl });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});
