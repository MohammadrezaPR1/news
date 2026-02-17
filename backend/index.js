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
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://fabulous-dragon-21e7fa.netlify.app"
].filter(Boolean);

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    }
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

// Root routes for testing
app.get("/.netlify/functions/index", (req, res) => {
    res.json({ message: "API is running successfully on Netlify!" });
});

app.get("/", (req, res) => {
    res.json({ message: "Backend Root is working!" });
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


