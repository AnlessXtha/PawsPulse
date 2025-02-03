import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
