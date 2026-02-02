"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_comment_controller_1 = __importDefault(require("../controllers/post_comment_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.post("/:postId", auth_middleware_1.default, post_comment_controller_1.default.post.bind(post_comment_controller_1.default));
router.put("/:id", auth_middleware_1.default, post_comment_controller_1.default.putById.bind(post_comment_controller_1.default));
router.delete("/:id", auth_middleware_1.default, post_comment_controller_1.default.deleteById.bind(post_comment_controller_1.default));
exports.default = router;
//# sourceMappingURL=post_comment_route.js.map