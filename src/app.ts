import express from "express";

const app = express();
const port: number = 3000;

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});