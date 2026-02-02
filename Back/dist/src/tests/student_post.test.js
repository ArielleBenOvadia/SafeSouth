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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_post_model_1 = __importDefault(require("../models/user_post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const user = {
    email: "test@student.post.test",
    password: "1234567890",
}; // fix typing to match IUser
let accessToken = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': user.email });
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
    user._id = response.body._id;
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response2.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
let post1 = {
    post_owner_email: "test@gmail.com",
    post_owner_phone: "05544483933",
    created_at: new Date(),
    location: "Givat moshe",
    title: "title1",
    message: "message1",
    kosher_home: true,
    shabat_save: true,
    handicap_home: true,
    animals_home: true,
    capacity: 20,
    comments: [],
    date_start: new Date(Date.now() + 24 * 60 * 60 * 1000),
    date_end: new Date(Date.now() + 24 * 60 * 60 * 1000),
    owner: user._id
};
describe("Student post tests", () => {
    const addStudentPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/post")
            .set("Authorization", "Bearer " + accessToken)
            .send(post);
        post1._id = response.body._id;
        expect(response.statusCode).toBe(201);
        expect(response.body.owner._id).toBe(user._id);
        expect(response.body.title).toBe(post.title);
        expect(response.body.message).toBe(post.message);
    });
    const editStudentPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .put(`/post/${post1._id}`)
            .set("Authorization", "Bearer " + accessToken)
            .send(post);
        post1 = response.body;
        expect(response.statusCode).toBe(201);
        expect(response.body.owner._id).toBe(user._id);
        expect(response.body.title).toBe(post.title);
        expect(response.body.message).toBe(post1.message);
    });
    const deleteStudentPost = () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/post/${post1._id}`)
            .set("Authorization", "Bearer " + accessToken)
            .send();
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).get("/post");
        expect(response2.statusCode).toBe(200);
        expect(response2.body).toStrictEqual([]);
    });
    test("Test Get All Student posts - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test Post Student post", () => __awaiter(void 0, void 0, void 0, function* () {
        yield addStudentPost(post1);
    }));
    test("Test Put Student post (Edit)", () => __awaiter(void 0, void 0, void 0, function* () {
        yield editStudentPost({ title: "New title!" });
    }));
    test("Test Get All Students posts with one post in DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/post");
        expect(response.statusCode).toBe(200);
        const rc = response.body[0];
        expect(rc.title).toBe(post1.title);
        expect(rc.message).toBe(post1.message);
        expect(rc.owner._id).toBe(user._id);
    }));
    test("Test Delete Student pos", () => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteStudentPost();
    }));
});
//# sourceMappingURL=student_post.test.js.map