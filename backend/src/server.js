import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import serve from "inngest";
import { inngest } from "./lib/inngest.js";

const app = express();

const __dirname = path.resolve();

// middlewares
app.use(express.json());

// server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("api/inngest", serve);
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "API is up and running" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log("🌐 Server is running on port:", ENV.PORT);
    });
  } catch (error) {
    console.log("❌ Error starting the server", error);
  }
};

startServer();
