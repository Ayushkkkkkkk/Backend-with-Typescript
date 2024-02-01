import express from "express";
import { getAllUsers, newUser, getUser, deleteUser } from "../controllers/user.js";
const app = express.Router();
// /api/v1/user/new
// add new user
app.post("/new", newUser);
// get all user
app.get("/all", getAllUsers);
// get single user and deleate user
app.route("/:id").get(getUser).delete(deleteUser);
export default app;
