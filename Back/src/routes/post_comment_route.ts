import express from "express";
const router = express.Router();
import commentController from "../controllers/post_comment_controller";
import authMiddleware from "../common/auth_middleware";

router.post("/:postId", authMiddleware, commentController.post.bind(commentController));
router.put("/:id", authMiddleware, commentController.putById.bind(commentController));
router.delete("/:id", authMiddleware, commentController.deleteById.bind(commentController));

export default router;
