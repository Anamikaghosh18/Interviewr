import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";

const app = express();

const __dirname = path.resolve();

app.get("/api", (req, res) => {
  res.status(200).json({ msg: "Success from server" });
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
