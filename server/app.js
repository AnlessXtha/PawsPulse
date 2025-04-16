/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import petRoute from "./routes/pet.route.js";
import appointmentRoute from "./routes/appointment.route.js";
import reportRoute from "./routes/report.route.js";
// import postRoute from "./routes/post.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/pets", petRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/reports", reportRoute);

app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(8805, () => {
  console.log("Server is running on port 8805");
});
