import express from "express";
// importing routes
import userRoutes from "./routes/user.js";
const app = express();
const port = 3000;
// using routers
app.use("/api/v1/user", userRoutes);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
