import express from "express";
import {getFeedPosts,getUserPosts,likePost,commentPost} from "../controllers/post.js";

import {verifyToken} from "../middleware/auth.js";
const router  =express.Router();

router.get("/",verifyToken,getFeedPosts);
router.get("/:userId/posts",verifyToken,getUserPosts);
router.patch("/:id/like",verifyToken,likePost);

// for commenting on a post 
router.post("/:id/comments",verifyToken,commentPost);

export default router;
