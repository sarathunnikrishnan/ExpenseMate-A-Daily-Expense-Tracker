import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import reportRoutes from "./routes/reportRoutes";
import accountRoutes from "./routes/accountRoutes";
import healthRoutes from "./routes/healthRoutes";
import { getDashboardHtml } from "./utils/dashboardHtml";
import { addLog } from "./utils/statusLogger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log incoming requests for diagnostics & ensure DB connection on serverless
app.use(async (req, res, next) => {
  if (req.path.startsWith("/api/") && !req.path.startsWith("/api/health")) {
    addLog("info", "API", `${req.method} ${req.path}`);
  }
  if (req.path.startsWith("/api/") && mongoose.connection.readyState === 0 && process.env.MONGO_URI) {
    await connectDB();
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/health", healthRoutes);

// Root UI Dashboard
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(getDashboardHtml());
});

// Database connection
async function connectDB() {
  const mongoURI = process.env.MONGO_URI as string;
  if (!mongoURI) {
    addLog("error", "DATABASE", "MONGO_URI environment variable is completely missing!", "Please configure MONGO_URI in your backend .env file or Vercel Environment Variables.");
    return;
  }

  try {
    addLog("info", "DATABASE", "Connecting to MongoDB database...");
    
    // Using family: 4 forces IPv4, which fixes a very common Vercel DNS resolution bug with MongoDB Atlas
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      family: 4 
    } as mongoose.ConnectOptions);
    
    addLog("success", "DATABASE", `MongoDB Connected successfully to host: ${mongoose.connection.host || "Database"}`);
  } catch (error: any) {
    const errDetails = error?.stack || error?.message || String(error);
    addLog("error", "DATABASE", "Failed to connect to MongoDB", errDetails);
  }
};

// Initialize DB Connection
connectDB();
addLog("info", "SERVER", `ExpenseMate API engine initialized in ${process.env.NODE_ENV || "development"} mode.`);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    addLog("info", "SERVER", `Server listening on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
