import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import studentPostRoute from "./routes/user_post_route";
import studentPostCommentRoute from "./routes/post_comment_route";
import cors from 'cors'
import authRoute from "./routes/auth_route";
import fileRoute from "./routes/file_route";

const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!).then(() => {
      const app = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(cors())
      app.use("/post", studentPostRoute);
      app.use("/postComment", studentPostCommentRoute);
      app.use("/auth", authRoute);
      app.use("/file", fileRoute);
      app.use("/public", express.static("public"));
      resolve(app);
    });
  });
  return promise;
};

export default initApp;