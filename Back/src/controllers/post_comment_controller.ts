import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthResquest } from "../common/auth_middleware";
import user_model from "../models/user_model";
import post_comment, { IComment } from "../models/post_comment";
import user_post_model, { IPost } from "../models/user_post_model";

class PostCommentController extends BaseController<IComment> {
    constructor() {
        super(post_comment)
    }

    async post(req: AuthResquest, res: Response) {
        const _id = req.user._id;
        req.body.owner = _id;
        const message = req.body.message
        const postId = req.params.postId
        try {
            let comment = await this.model.create({
                 comment_owner: _id,
                 message,
                 post: postId
            });
            comment = await comment.populate("comment_owner")
            await user_post_model.findByIdAndUpdate(postId, {$push: {  comments: comment._id}})
            res.status(200).send(comment);
        } catch (err) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }

    async deleteById(req: AuthResquest, res: Response) {
        try {
            const comment_ = await this.model.findById(req.params.id).populate("post");
            if(comment_.comment_owner.toString() !== req.user._id.toString()
            && (comment_.post as IPost).owner.toString() !== req.user._id.toString()) {
                res.status(401).send("Unauthorized");
            }
            const comment = await this.model.findByIdAndDelete(req.params.id);
            await user_post_model.findByIdAndUpdate(comment.value.post, {$pull: {  comments: req.params.id}})
            res.status(201).send(comment);
        } catch (err) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }


    async putById(req: AuthResquest, res: Response) {
        try {
            const comment = await this.model.findByIdAndUpdate(req.params.id, req.body, {returnOriginal:false});
            res.status(201).send(comment);
        } catch (err) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }
}

export default new PostCommentController();
