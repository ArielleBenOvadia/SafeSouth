"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const student_post_controller_1 = __importDefault(require("../controllers/student_post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
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
router.get("/", student_post_controller_1.default.get.bind(student_post_controller_1.default));
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
router.get("/:id", student_post_controller_1.default.getById.bind(student_post_controller_1.default));
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
router.post("/", auth_middleware_1.default, student_post_controller_1.default.post.bind(student_post_controller_1.default));
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
router.put("/:id", auth_middleware_1.default, student_post_controller_1.default.putById.bind(student_post_controller_1.default));
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
router.delete("/:id", auth_middleware_1.default, student_post_controller_1.default.deleteById.bind(student_post_controller_1.default));
exports.default = router;
//# sourceMappingURL=student_post_route.js.map