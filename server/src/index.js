import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import quizRoutes from "./routes/quiz.routes.js";

//Load environment variables and connect to the database
dotenv.config();
connectDB();

//Create Express app and apply middleware
const app = express();

//CORS configuration to allow requests from the frontend, including credentials for cookies
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

//Mount routes for authentication, courses, and lessons
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courses/:courseId/lessons", lessonRoutes);
app.use("/api/courses/:courseId/quiz", quizRoutes);

//Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));