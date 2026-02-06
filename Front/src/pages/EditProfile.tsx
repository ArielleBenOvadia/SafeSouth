import React, { ChangeEvent, useRef, useState } from "react";
import avatar from "../assets/avatar_pic.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faClose } from "@fortawesome/free-solid-svg-icons";
import { uploadPhoto } from "../services/file-service";
import { editUser } from "../services/user-service";
import { IUser, Gender, IUserWithPosts } from "../@Types";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import AuthorizedGuard from "../guards/AuthorizedGuard";
import { normalizePosts, usePosts } from "../context/PostContext";
import axios from "axios";

function EditProfile() {
  const [imgSrc, setImgSrc] = useState<File>();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { updatePostOwner } = usePosts();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);

  const { user: currentUser, setUser } = useAuth();
  const [showingImages, setShowingImages] = useState(false);

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  const edit = async () => {
    if (!currentUser) return;

    const first = firstNameRef.current?.value?.trim();
    const last = lastNameRef.current?.value?.trim();
    const genderVal = (genderRef.current?.value ?? "") as Gender | "";

    if (!first || !last) {
      toast.error("(:אנא מלא/י שם פרטי ושם משפחה");
      return;
    }

    setLoading(true);
    try {
      let url: string | undefined = "";
      if (imgSrc) url = await uploadPhoto(imgSrc);
      else url = currentUser.imgUrl;

      const pass =
        passwordInputRef.current?.value && passwordInputRef.current.value.length > 0
          ? passwordInputRef.current.value
          : currentUser.password;

      // ⚠️ חשוב: לא "למחוק" gender בטעות
      // אם לא נבחר gender חדש, נשמור את הקיים (אם יש)
      const finalGender =
        genderVal === "male" || genderVal === "female" ? genderVal : currentUser.gender;

      const updatedUser: Partial<IUser> = {
        email: currentUser.email,
        password: pass,
        first_name: first,
        last_name: last,
        imgUrl: url,
        posts: currentUser.posts.map((p: any) => (typeof p === "string" ? p : p._id)),
        ...(finalGender ? { gender: finalGender } : {}),
      };

      const res = await editUser(updatedUser, pass !== currentUser.password);

      if (!res) {
        toast.error("שגיאה בשמירת הפרטים");
        return;
      }

      // ✅ רענון קשיח מהשרת כדי לוודא שהבאק באמת שמר והחזיר gender
      const me = await axios.get<IUserWithPosts>("/auth/me");
      const freshUser = me.data;

      if (freshUser?.posts) {
        freshUser.posts = normalizePosts(freshUser.posts as any);
      }

      updatePostOwner(freshUser);
      setUser(freshUser);

      toast.success("(:!הפרטים נשמרו בהצלחה");
      nav("/profile");
    } catch (e) {
      toast.error("שגיאה בשמירת הפרטים, נסי שוב מאוחר יותר");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <form className="vstack gap-3 col-md-7 mx-auto">
      <h1 className="text-center p-2 font-bold text-[32px]">עריכת פרופיל</h1>

      <div className="d-flex justify-content-center position-relative">
        <img
          onClick={() => {
            if (imgSrc || currentUser?.imgUrl) setShowingImages(true);
          }}
          src={(imgSrc ? URL.createObjectURL(imgSrc) : currentUser?.imgUrl) ?? avatar}
          style={{ height: "230px", width: "230px" }}
          className="object-contain"
          alt="Profile"
        />
        <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
          <FontAwesomeIcon icon={faImage} className="fa-xl" />
        </button>
      </div>

      <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected} />

      <div className="form-floating">
        <input
          ref={firstNameRef}
          defaultValue={currentUser?.first_name}
          required
          type="text"
          className="form-control"
          id="floatingFirstName"
          placeholder=""
        />
        <label htmlFor="floatingFirstName">שם פרטי</label>
      </div>

      <div className="form-floating">
        <input
          ref={lastNameRef}
          defaultValue={currentUser?.last_name}
          required
          type="text"
          className="form-control"
          id="floatingLastName"
          placeholder=""
        />
        <label htmlFor="floatingLastName">שם משפחה</label>
      </div>

      <div className="form-floating">
        <select
          ref={genderRef}
          className="form-control"
          id="floatingGender"
          defaultValue={currentUser.gender ?? ""}
        >
          <option value="">לא נבחר</option>
          <option value="female">נקבה</option>
          <option value="male">זכר</option>
        </select>
        <label htmlFor="floatingGender">מין</label>
      </div>

      <div className="form-floating">
        <input
          ref={passwordInputRef}
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder=""
        />
        <label htmlFor="floatingPassword">סיסמה</label>
      </div>

      <button
        style={{ background: loading ? "gray" : "white", color: "black" }}
        disabled={loading}
        type="button"
        className=" bg-[var(--color-green-light-2)] font-bold text-[20px] hover:opacity-[0.8] p-2 rounded-md"
        onClick={edit}
      >
        שמור פרטים
      </button>

      {loading && <Spinner spinnerSize="lg" />}

      {showingImages && (
        <div className="fixed bg-[rgba(0,0,0,0.5)] grid items-center top-0 bottom-0 left-0 right-0">
          <div className="min-w-[300px] rounded-lg grid place-items-center grid-cols-1 grid-rows-1 p-4 w-[60%] max-w-[600px] mx-auto min-h-[300px] bg-white">
            <img
              src={(imgSrc ? URL.createObjectURL(imgSrc) : currentUser?.imgUrl) ?? avatar}
              className="object-contain w-[200px] h-[200px] rounded-full"
              alt="No provided"
            />
          </div>
          <FontAwesomeIcon
            color="white"
            size="3x"
            className="fixed cursor-pointer top-[2rem] right-[2rem]"
            icon={faClose}
            onClick={() => setShowingImages(false)}
          />
        </div>
      )}
    </form>
  );
}

export default AuthorizedGuard(EditProfile);
