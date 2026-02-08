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
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const user_model_2 = __importDefault(require("../models/user_model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new google_auth_library_1.OAuth2Client();
const googleSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const ticket = yield client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (email != null) {
            let user = yield user_model_1.default.findOne({ email });
            if (user == null) {
                // ✅ לא מחייבים gender ב-Google
                user = yield user_model_1.default.create({
                    email,
                    password: '0',
                    imgUrl: payload === null || payload === void 0 ? void 0 : payload.picture,
                });
            }
            const tokens = yield generateTokens(user);
            return res.status(200).send(Object.assign({ email: user.email, _id: user._id, imgUrl: user.imgUrl, gender: user.gender }, tokens));
        }
        return res.status(400).send("Google payload missing email");
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, imgUrl, gender } = req.body;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    // ✅ בהרשמה רגילה חובה לבחור מין
    if (gender !== "male" && gender !== "female") {
        return res.status(400).send("missing gender");
    }
    try {
        const exists = yield user_model_1.default.findOne({ email });
        if (exists) {
            return res.status(406).send("email already exists");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const created = yield user_model_1.default.create(Object.assign(Object.assign({}, req.body), { email, password: encryptedPassword, imgUrl,
            gender }));
        const tokens = yield generateTokens(created);
        return res.status(201).send(Object.assign({ email: created.email, _id: created._id, imgUrl: created.imgUrl, gender: created.gender }, tokens));
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const generateTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
    const u = user;
    if (u.refreshTokens == null) {
        u.refreshTokens = [refreshToken];
    }
    else {
        u.refreshTokens.push(refreshToken);
    }
    yield user.save();
    return { accessToken, refreshToken };
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (user == null) {
            return res.status(401).send("email or password incorrect");
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).send("email or password incorrect");
        }
        const tokens = yield generateTokens(user);
        return res.status(200).send(tokens);
    }
    catch (err) {
        return res.status(400).send("error missing email or password");
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.sendStatus(401);
        try {
            const userDb = yield user_model_1.default.findOne({ _id: user._id });
            if (!userDb)
                return res.sendStatus(401);
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                yield userDb.save();
                return res.sendStatus(401);
            }
            userDb.refreshTokens = userDb.refreshTokens.filter((t) => t !== refreshToken);
            yield userDb.save();
            return res.sendStatus(200);
        }
        catch (e) {
            return res.status(401).send(e.message);
        }
    }));
});
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.editedPass) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const encryptedPassword = yield bcrypt_1.default.hash(req.body.user.password, salt);
            req.body.user.password = encryptedPassword;
        }
        // ✅ FIX קריטי:
        // returnOriginal לא אמין בגרסאות Mongoose חדשות → מחזיר לפעמים את המשתמש הישן
        // new:true יחזיר את הדוקומנט המעודכן, runValidators יוודא enum של gender
        const rs = yield user_model_1.default.findByIdAndUpdate(req.user._id, req.body.user, { new: true, runValidators: true }).populate({
            path: "posts",
            populate: [{
                    path: "comments",
                    populate: { path: "comment_owner" }
                }, { path: "owner" }]
        });
        return res.status(200).send(rs);
    }
    catch (e) {
        return res.status(400).send(e.message);
    }
});
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    try {
        const user = yield user_model_2.default.findById(userId).populate({
            path: "posts",
            populate: [{
                    path: "comments",
                    populate: { path: "comment_owner" }
                }, { path: "owner" }]
        });
        return res.status(200).json(user);
    }
    catch (e) {
        return res.sendStatus(401);
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split('Bearer ')[1];
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.sendStatus(401);
        try {
            const userDb = yield user_model_1.default.findById(user._id);
            if (!userDb)
                return res.sendStatus(401);
            if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                yield userDb.save();
                return res.sendStatus(401);
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            userDb.refreshTokens = userDb.refreshTokens.filter((t) => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            yield userDb.save();
            return res.status(200).send({
                accessToken,
                refreshToken: newRefreshToken
            });
        }
        catch (e) {
            return res.status(401).send(e.message);
        }
    }));
});
exports.default = {
    googleSignin,
    register,
    login,
    logout,
    me,
    refresh,
    editUser
};
//# sourceMappingURL=auth_controller.js.map