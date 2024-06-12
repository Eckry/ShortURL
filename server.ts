import express from "express";
import cors from "cors";
import { createClient } from "@libsql/client";
import dotenv from "dotenv"

dotenv.config();



export const turso = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_AUTH_TOKEN,
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/addurl", async (req, res) => {
  const { url }: { url: string } = req.body;
  const result = await turso.execute({
    sql: "SELECT shortUrl FROM urls WHERE realUrl = :url",
    args: { url: url },
  });

  if (result.rows.length > 0) {
    const [{ shortUrl }] = result.rows;
    res.status(200).send({ message: "Url already exists", shortUrl });
  }
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
});
