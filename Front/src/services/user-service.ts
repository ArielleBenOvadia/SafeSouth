import { CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { IToken, IUser, IUserWithPosts } from "../@Types";

export const registrUser = (user: Partial<IUser>) => {
  return new Promise<IUser>((resolve, reject) => {
    console.log("Registering user...");
    console.log(user);
    axios
      .post("/auth/register", user)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export const editUser = (user: Partial<IUser>, editedPass: boolean) => {
  return new Promise<IUserWithPosts>((resolve, reject) => {
    delete user._id;
    axios
      .put("/auth", { user, editedPass })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export const loginUser = (email: string, password: string) => {
  return new Promise<IToken>((resolve, reject) => {
    axios
      .post("/auth/login", { email, password })
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

// ✅ Google Sign-in לא מחייב gender
export const googleSignin = (credentialResponse: CredentialResponse) => {
  return new Promise<IUser>((resolve, reject) => {
    console.log("googleSignin ...");
    axios
      .post("/auth/google", credentialResponse)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};
