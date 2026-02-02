"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base_controller");
const post_comment_1 = __importDefault(require("../models/post_comment"));
const user_post_model_1 = __importDefault(require("../models/user_post_model"));
class PostCommentController extends base_controller_1.BaseController {
    constructor() {
        super(post_comment_1.default);
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = req.user._id;
            req.body.owner = _id;
            const message = req.body.message;
            const postId = req.params.postId;
            try {
                let comment = yield this.model.create({
                    comment_owner: _id,
                    message,
                    post: postId
                });
                comment = yield comment.populate("comment_owner");
                yield user_post_model_1.default.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
                res.status(200).send(comment);
            }
            catch (err) {
                console.log(err);
                res.status(406).send("fail: " + err.message);
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment_ = yield this.model.findById(req.params.id).populate("post");
                if (comment_.comment_owner.toString() !== req.user._id.toString()
                    && comment_.post.owner.toString() !== req.user._id.toString()) {
                    res.status(401).send("Unauthorized");
                }
                const comment = yield this.model.findByIdAndDelete(req.params.id);
                yield user_post_model_1.default.findByIdAndUpdate(comment.value.post, { $pull: { comments: req.params.id } });
                res.status(201).send(comment);
            }
            catch (err) {
                console.log(err);
                res.status(406).send("fail: " + err.message);
            }
        });
    }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield this.model.findByIdAndUpdate(req.params.id, req.body, { returnOriginal: false });
                res.status(201).send(comment);
            }
            catch (err) {
                console.log(err);
                res.status(406).send("fail: " + err.message);
            }
        });
    }
}
exports.default = new PostCommentController();
//# sourceMappingURL=post_comment_controller.js.map