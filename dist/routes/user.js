import express from "express";
import { getAllUsers, newUser, getUser, deleteUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// /api/v1/user/new
// add new user
app.post("/new", newUser);
// get all user
app.get("/all", adminOnly, getAllUsers);
// get single user and deleate user
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);
export default app;
