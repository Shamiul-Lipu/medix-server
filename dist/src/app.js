import express from "express";
import cors from "cors";
import { allApiRoutes } from "./routes/apiRoutes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import globalErrorHandler from "./middleware/globalErrorHandler";
const app = express();
app.use(cors({
    origin: process.env.API_URL || "http://localhost:3000", // client url
    credentials: true,
}));
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
// Health check route
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "App is running",
    });
});
// load all API modules
app.use("/api/v1", allApiRoutes);
// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: `Route ${req.originalUrl} not found`,
    });
});
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map