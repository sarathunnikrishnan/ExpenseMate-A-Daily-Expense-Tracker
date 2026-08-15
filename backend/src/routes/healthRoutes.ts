import express from "express";
import mongoose from "mongoose";
import { getSystemHealth, getLogs, clearLogs, addLog } from "../utils/statusLogger";

const router = express.Router();

// GET /api/health - Returns system health & service connection status JSON
router.get("/", (req, res) => {
  res.json(getSystemHealth());
});

// GET /api/health/logs - Returns detailed system diagnostic logs
router.get("/logs", (req, res) => {
  res.json({ logs: getLogs() });
});

// DELETE /api/health/logs - Clear logs buffer
router.delete("/logs", (req, res) => {
  clearLogs();
  addLog("info", "SERVER", "In-memory system log buffer cleared by user action.");
  res.json({ message: "Logs cleared successfully" });
});

// POST /api/health/retry-db - Attempt MongoDB reconnect
router.post("/retry-db", async (req, res) => {
  const mongoURI = process.env.MONGO_URI as string;
  if (!mongoURI) {
    addLog("error", "DATABASE", "Re-connection attempt failed: MONGO_URI environment variable is completely missing!");
    return res.status(400).json({ message: "MONGO_URI environment variable is completely missing!" });
  }

  addLog("info", "DATABASE", "Initiating manual database re-connection attempt...");

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    } as mongoose.ConnectOptions);

    addLog("success", "DATABASE", `MongoDB Re-connected successfully to host: ${mongoose.connection.host || "Atlas/Local"}`);
    return res.json({ message: "MongoDB Re-connected successfully!", status: "connected" });
  } catch (error: any) {
    const errMessage = error?.message || String(error);
    addLog("error", "DATABASE", "Manual MongoDB re-connection failed", errMessage);
    return res.status(500).json({ message: "MongoDB connection failed: " + errMessage });
  }
});

export default router;
