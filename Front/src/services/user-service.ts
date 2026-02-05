import { CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { IUser, IUserWithPosts, Gender } from "../@Types";

export const registrUser = (user: Partial<IUser>) => {
  return new Promise<IUser>((resolve, reject) => {
    axios.post("/auth/register", user)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export const editUser = (user: Partial<IUser>, editedPass: boolean) => {
  return new Promise<IUserWithPosts>((resolve, reject) => {
    delete user._id;
    axios.put("/auth", { user, editedPass })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export const loginUser = (email: string, password: string) => {
  return new Promise<any>((resolve, reject) => {
    axios.post("/auth/login", { email, password })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

// ✅ שינוי: googleSignin מקבל גם gender
export const googleSignin = (credentialResponse: CredentialResponse, gender: Gender) => {
  return new Promise<IUser>((resolve, reject) => {
    axios.post("/auth/google", { ...credentialResponse, gender })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};
