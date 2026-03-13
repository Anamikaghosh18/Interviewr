import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

const __dirname = path.resolve();

// middlewares
app.use(express.json());

// server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);

app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use(clerkMiddleware()); // this adds auth field to request object

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "API is up and running" });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log("Server is running on port:", ENV.PORT);
    });
  } catch (error) {
    console.log("Error starting the server", error);
  }
};

startServer();
