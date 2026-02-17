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

const allowedOrigins = [
    "https://fabulous-dragon-21e7fa.netlify.app",
    "http://fabulous-dragon-21e7fa.netlify.app",
    "https://mediana1.netlify.app",
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // Allow if origin is in our list OR if it's the same domain
        if (!origin || allowedOrigins.includes(origin) || origin.includes("netlify.app")) {
            callback(null, true);
        } else {
            console.warn(`Blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(cookieParser());

// Consolidated Router
const mainRouter = express.Router();
mainRouter.use(userRoutes);
mainRouter.use(categoryRoutes);
mainRouter.use(videoRoutes);
mainRouter.use(newsRoutes);
mainRouter.use(commentRoutes);
mainRouter.use(sendEmailRoutes);

// Health check on the router itself
mainRouter.get("/", (req, res) => {
    res.json({
        message: "API Router is active!",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Final mounting strategy
app.use("/api", mainRouter);
app.use("/.netlify/functions/index", mainRouter);
app.use("/", mainRouter);

// Catch-all for 404s with detail for debugging
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        path: req.originalUrl,
        proxyPath: req.url,
        method: req.method,
        help: "If you see this, the request reached the backend but no route matched."
    });
});

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


