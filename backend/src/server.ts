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

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/accounts", accountRoutes);

app.get("/", (req, res) => {
  res.send("ExpenseMate API is running");
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI as string;
    if (!mongoURI) {
      console.error("ERROR: MONGO_URI environment variable is completely missing!");
      process.exit(1);
    }
    
    // Using family: 4 forces IPv4, which fixes a very common Vercel DNS resolution bug with MongoDB Atlas
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      family: 4 
    } as mongoose.ConnectOptions);
    
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

connectDB();

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
