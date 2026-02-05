import express, { Request, Response } from "express";
import cors from "cors";
import { allApiRoutes } from "./routes/apiRoutes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();
app.use(express.json());

// app.use(
//   cors({
//     origin: process.env.API_URL || "https://medix-client.vercel.app", // client url
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   }),
// );

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = ["https://medix-client.vercel.app"].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "App is running",
  });
});

// load all API modules
app.use("/api/v1", allApiRoutes);

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(globalErrorHandler);

export default app;
