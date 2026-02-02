import express from "express";
const router = express.Router();
import studentPostController from "../controllers/user_post_controller";
import authMiddleware from "../common/auth_middleware";

/**
 * @swagger
 * tags:
 *   name: StudentPosts
 *   description: API endpoints for managing student posts
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /student-posts:
 *   get:
 *     summary: Get all student posts
 *     tags: [StudentPosts]
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized
 */

router.get("/", studentPostController.get.bind(studentPostController));

/**
 * @swagger
 * /student-posts/{id}:
 *   get:
 *     summary: Get a student post by ID
 *     tags: [StudentPosts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the student post
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student post not found
 */

router.get("/:id", studentPostController.getById.bind(studentPostController));

/**
 * @swagger
 * /student-posts:
 *   post:
 *     summary: Create a new student post
 *     tags: [StudentPosts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Student post created successfully
 *       401:
 *         description: Unauthorized
 */

router.post("/", authMiddleware, studentPostController.post.bind(studentPostController));

/**
 * @swagger
 * /student-posts/{id}:
 *   put:
 *     summary: Update a student post by ID
 *     tags: [StudentPosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the student post
 *     responses:
 *       200:
 *         description: Student post updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student post not found
 */

router.put("/:id", authMiddleware, studentPostController.putById.bind(studentPostController));

/**
 * @swagger
 * /student-posts/{id}:
 *   delete:
 *     summary: Delete a student post by ID
 *     tags: [StudentPosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the student post
 *     responses:
 *       200:
 *         description: Student post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student post not found
 */

router.delete("/:id", authMiddleware, studentPostController.deleteById.bind(studentPostController));

export default router;
