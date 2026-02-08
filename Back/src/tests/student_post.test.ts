import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import StudentPost, { IPost } from "../models/user_post_model";
import User, { IUser } from "../models/user_model";

let app: Express;
const user: IUser = {
  email: "test@student.post.test",
  password: "1234567890",
} as any // fix typing to match IUser
let accessToken = "";

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await StudentPost.deleteMany();

  await User.deleteMany({ 'email': user.email });
  const response = await request(app).post("/auth/register").send(user);
  user._id = response.body._id;
  const response2 = await request(app).post("/auth/login").send(user);
  accessToken = response2.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

let post1: IPost = {
    post_owner_email:"test@gmail.com",
    post_owner_phone:"05544483933",
    created_at:new Date(),
    location:"Givat moshe",
    title: "title1",
    message: "message1",
    kosher_home:true,
    shabat_save:true,
    handicap_home:true,
    animals_home: true,
    capacity:20,
    comments:[],
    date_start: new Date(Date.now() + 24 * 60 * 60 * 1000),
    date_end: new Date(Date.now() + 24 * 60 * 60 * 1000),
    owner:  user._id as any
  }

describe("Student post tests", () => {
  const addStudentPost = async (post: IPost) => {
    const response = await request(app)
        .post("/post")
        .set("Authorization", "Bearer " + accessToken) // ה bearer בודק שרק משתמש מחובר יכול לפרסם פוסט
        .send(post);
    post1._id  = response.body._id
    expect(response.statusCode).toBe(201);
    expect(response.body.owner._id).toBe(user._id);
    expect(response.body.title).toBe(post.title);
    expect(response.body.message).toBe(post.message);
  };

  const editStudentPost = async (post: Partial<IPost>) => {
    const response = await request(app)
      .put(`/post/${post1._id}`)
      .set("Authorization", "Bearer " + accessToken)
      .send(post);
    post1 = response.body 
    expect(response.statusCode).toBe(201);
    expect(response.body.owner._id).toBe(user._id);
    expect(response.body.title).toBe(post.title);
    expect(response.body.message).toBe(post1.message);
  };

  const deleteStudentPost = async () => {
    const response = await request(app)
      .delete(`/post/${post1._id}`)
      .set("Authorization", "Bearer " + accessToken)
      .send()
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).get("/post");
    expect(response2.statusCode).toBe(200);
    expect(response2.body).toStrictEqual([]);
  };



  test("Test Get All Student posts - empty response", async () => {
    const response = await request(app).get("/post");
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test Post Student post", async () => {
    await addStudentPost(post1);
});

test("Test Put Student post (Edit)" , async () => {
  await editStudentPost({ title: "New title!" });
});

test("Test Get All Students posts with one post in DB", async () => {
const response = await request(app).get("/post");
expect(response.statusCode).toBe(200);
const rc = response.body[0];
expect(rc.title).toBe(post1.title);
expect(rc.message).toBe(post1.message);
expect(rc.owner._id).toBe(user._id);
});

test("Test Delete Student pos" , async () => {
  await deleteStudentPost()
});

});
