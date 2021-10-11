/**
 * All UserRoutes should be set up here
 */
import express from "express";
import { signin, signup, logout } from "../Controller/AuthController.js";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  follow,
  unfollow,
} from "../Controller/UserController.js";

const router = express.Router();

// Auth
router.post("/signin", signin);
router.post("/signup", signup);
router.post("/logout", logout);

// users
router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.patch("/follow/:id", follow);
router.patch("/unfollow/:id", unfollow);

// a post query on website.com/register will execute AuthController

export default router;

// router.get('/', getPosts);
// router.post('/', createPost);
// router.get('/:id', getPost);
// router.patch('/:id', updatePost);
// router.delete('/:id', deletePost);
// router.patch('/:id/likePost', likePost);
