import express from "express";
import db from "./config/Database.js";
import userRoutes from "./routes/userRoute.js"
import categoryRoutes from "./routes/categoryRoute.js";
import videoRoutes from "./routes/videoRoute.js";
import newsRoutes from "./routes/newsRoute.js"
import commentRoutes from "./routes/commentRoute.js"
import sendEmailRoutes from "./routes/sendEmailRoute.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import serverless from "serverless-http";


dotenv.config();
const app = express();

const connectDB = async () => {
    try {
        await db.authenticate();
        console.log("Database connected !");
        await db.sync({ alter: true });
    } catch (error) {
        console.error("Critical Database Error Details:", error);
    }
}

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(cookieParser());

// Prefix routes for Netlify Functions if needed, e.g., /.netlify/functions/index
app.use("/.netlify/functions/index", userRoutes);
app.use("/.netlify/functions/index", categoryRoutes);
app.use("/.netlify/functions/index", videoRoutes);
app.use("/.netlify/functions/index", newsRoutes);
app.use("/.netlify/functions/index", commentRoutes);
app.use("/.netlify/functions/index", sendEmailRoutes);

// For local development
if (process.env.NODE_ENV !== "production") {
    connectDB();
    app.listen(5000, () => {
        console.log("Server running on port 5000 !");
    });
} else {
    // Connect to DB once when function is initialized
    connectDB();
}

export const handler = serverless(app);


