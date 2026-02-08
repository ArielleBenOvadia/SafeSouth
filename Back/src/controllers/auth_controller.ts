import { Request, Response } from 'express';
import User, { IUser } from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { Document } from 'mongoose';
import user_model from '../models/user_model';
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client();

const googleSignin = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload?.email;

        if (email != null) {
            let user = await User.findOne({ email });

            if (user == null) {
                // ✅ לא מחייבים gender ב-Google
                user = await User.create({
                    email,
                    password: '0',
                    imgUrl: payload?.picture,
                });
            }

            const tokens = await generateTokens(user);

            return res.status(200).send({
                email: user.email,
                _id: user._id,
                imgUrl: user.imgUrl,
                gender: (user as any).gender,
                ...tokens
            });
        }

        return res.status(400).send("Google payload missing email");
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
};

const register = async (req: Request, res: Response) => {
    const { email, password, imgUrl, gender } = req.body;

    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }


    if (gender !== "male" && gender !== "female") {
        return res.status(400).send("missing gender");
    }

    try {
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(406).send("email already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        const created = await User.create({
            ...req.body,
            email,
            password: encryptedPassword,
            imgUrl,
            gender, 
        });

        const tokens = await generateTokens(created);

        return res.status(201).send({
            email: created.email,
            _id: created._id,
            imgUrl: created.imgUrl,
            gender: (created as any).gender,
            ...tokens
        });
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
};

const generateTokens = async (user: Document & IUser) => {
    const accessToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRATION }
    );

    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_REFRESH_SECRET!
    );

    const u: any = user;
    if (u.refreshTokens == null) {
        u.refreshTokens = [refreshToken];
    } else {
        u.refreshTokens.push(refreshToken);
    }

    await user.save();

    return { accessToken, refreshToken };
};

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }

    try {
        const user = await User.findOne({ email });
        if (user == null) {
            return res.status(401).send("email or password incorrect");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send("email or password incorrect");
        }

        const tokens = await generateTokens(user);
        return res.status(200).send(tokens);
    } catch (err) {
        return res.status(400).send("error missing email or password");
    }
};

const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, async (err, user: any) => {
        if (err) return res.sendStatus(401);
        try {
            const userDb: any = await User.findOne({ _id: user._id });
            if (!userDb) return res.sendStatus(401);

            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            }

            userDb.refreshTokens = userDb.refreshTokens.filter((t: string) => t !== refreshToken);
            await userDb.save();
            return res.sendStatus(200);
        } catch (e: any) {
            return res.status(401).send(e.message);
        }
    });
};

const editUser = async (req: any, res: Response) => {
    try {
        if (req.body.editedPass) {
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(req.body.user.password, salt);
            req.body.user.password = encryptedPassword;
        }


        const rs = await User.findByIdAndUpdate(
            req.user._id,
            req.body.user,
            { new: true, runValidators: true }
        ).populate({
            path: "posts",
            populate: [{
                path: "comments",
                populate: { path: "comment_owner" }
            }, { path: "owner" }]
        });

        return res.status(200).send(rs);
    } catch (e: any) {
        return res.status(400).send(e.message);
    }
};

const me = async (req: any, res: Response) => {
    const userId = req.user._id!;
    try {
        const user = await user_model.findById(userId).populate({
            path: "posts",
            populate: [{
                path: "comments",
                populate: { path: "comment_owner" }
            }, { path: "owner" }]
        });

        return res.status(200).json(user);
    } catch (e) {
        return res.sendStatus(401);
    }
};

const refresh = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split('Bearer ')[1];
    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, async (err, user: any) => {
        if (err) return res.sendStatus(401);

        try {
            const userDb: any = await User.findById(user._id);
            if (!userDb) return res.sendStatus(401);

            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                await userDb.save();
                return res.sendStatus(401);
            }

            const accessToken = jwt.sign(
                { _id: user._id },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.JWT_EXPIRATION }
            );

            const newRefreshToken = jwt.sign(
                { _id: user._id },
                process.env.JWT_REFRESH_SECRET!
            );

            userDb.refreshTokens = userDb.refreshTokens.filter((t: string) => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            await userDb.save();

            return res.status(200).send({
                accessToken,
                refreshToken: newRefreshToken
            });
        } catch (e: any) {
            return res.status(401).send(e.message);
        }
    });
};

export default {
    googleSignin,
    register,
    login,
    logout,
    me,
    refresh,
    editUser
};
