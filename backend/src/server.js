import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";

const app = express();

const __dirname = path.resolve();

app.get("/api", (req, res) => {
  res.status(200).json({ msg: "Success from server" });
});

// make ready for prod
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));

export default app;
