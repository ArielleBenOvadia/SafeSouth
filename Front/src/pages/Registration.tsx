import { ChangeEvent, useRef, useState } from 'react'
import avatar from '../assets/avatar_pic.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { faClose } from '@fortawesome/free-solid-svg-icons';

import { uploadPhoto } from '../services/file-service'
import { registrUser, googleSignin } from '../services/user-service'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import AlreadyLoggedGuard from '../guards/AlreadyLoggedguard'
import { Gender, IUser } from '../@Types'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

function Registration() {
    const [imgSrc, setImgSrc] = useState<File>()
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()

    const fileInputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const passwordInputRef = useRef<HTMLInputElement>(null)

    // ✅ חובה בהרשמה רגילה
    const genderRef = useRef<HTMLSelectElement>(null)

    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0])
        }
    }

    const selectImg = () => fileInputRef.current?.click()

    const register = async () => {
        const gender = genderRef.current?.value as Gender | undefined

        if (
            emailInputRef.current?.value &&
            passwordInputRef.current?.value &&
            firstNameRef.current?.value &&
            lastNameRef.current?.value &&
            imgSrc &&
            (gender === "male" || gender === "female")
        ) {
            setLoading(true)
            try {
                const url = await uploadPhoto(imgSrc!, "profile.jpg")
                const user: IUser = {
                    email: emailInputRef.current.value,
                    password: passwordInputRef.current.value,
                    first_name: firstNameRef.current.value,
                    last_name: lastNameRef.current.value,
                    imgUrl: url,
                    gender, // ✅ חובה בהרשמה רגילה
                    posts: [],
                }

                const res = await registrUser(user)
                if (res) {
                    nav("/login")
                    toast.success("(:!נרשמת בהצלחה, מוזמן להתחבר")
                }
            } catch (e) {
                toast.error("שגיאה בהרשמה, נסה שוב מאוחר יותר")
            } finally {
                setLoading(false)
            }
        } else {
            toast.error("(:בבקשה מלא את כל השדות, בחר תמונת פרופיל ובחר מין")
        }
    }

    // ✅ Google לא מחייב מין
    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const res = await googleSignin(credentialResponse) // ✅ פרמטר אחד בלבד
            if (res.accessToken) {
                nav("/login")
                toast.success("(:!נרשמת/התחברת בהצלחה עם Google, כעת ניתן להתחבר")
            } else {
                toast.success("(:!התחברת בהצלחה עם Google, כעת ניתן להתחבר")
                nav("/login")
            }
        } catch (e) {
            toast.error("Google login failed")
        }
    }

    const onGoogleLoginFailure = () => {
        console.log("Google login failed")
    }

    const [showingImages, setShowingImages] = useState(false)

    return (
        <form className="vstack gap-3 col-md-7 mx-auto">
            <h1 className='text-center p-2 font-bold text-[32px]'>הירשמות</h1>

            <div className="d-flex justify-content-center position-relative">
                <img
                    onClick={() => { if (imgSrc) setShowingImages(true) }}
                    src={imgSrc ? URL.createObjectURL(imgSrc) : avatar}
                    style={{ height: "230px", width: "230px" }}
                    className="object-contain"
                />
                <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
                    <FontAwesomeIcon icon={faImage} className="fa-xl" />
                </button>
            </div>

            <input style={{ display: "none" }} required ref={fileInputRef} type="file" onChange={imgSelected} />

            <div className="form-floating">
                <input ref={emailInputRef} required type="email" className="form-control" id="floatingEmail" placeholder="" />
                <label htmlFor="floatingEmail">אימייל</label>
            </div>

            <div className="form-floating">
                <input ref={firstNameRef} required type="text" className="form-control" id="floatingFirst" placeholder="" />
                <label htmlFor="floatingFirst">שם פרטי</label>
            </div>

            <div className="form-floating">
                <input ref={lastNameRef} required type="text" className="form-control" id="floatingLast" placeholder="" />
                <label htmlFor="floatingLast">שם משפחה</label>
            </div>

            <div className="form-floating">
                <input ref={passwordInputRef} required type="password" className="form-control" id="floatingPass" placeholder="" />
                <label htmlFor="floatingPass">סיסמה</label>
            </div>

            {/* ✅ חובה בהרשמה רגילה */}
            <div className="form-floating">
                <select ref={genderRef} required className="form-control" id="floatingGender" defaultValue="">
                    <option value="" disabled>בחר/י מין</option>
                    <option value="female">נקבה</option>
                    <option value="male">זכר</option>
                </select>
                <label htmlFor="floatingGender">מין</label>
            </div>

            <button
                style={{ background: loading ? "gray" : "white", color: 'black' }}
                disabled={loading}
                type="button"
                className="p-4 mb-[42px] border-[black] border-[1px] w-fit min-w-[200px] mx-auto bg-[var(--color-green-light-2)] font-bold text-[20px] hover:opacity-[0.8] p-2 rounded-full"
                onClick={register}
            >
                הירשם
            </button>

            <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />

            {loading && <Spinner spinnerSize='lg' />}

            {showingImages && (
                <div className="fixed bg-[rgba(0,0,0,0.5)] grid items-center top-0 bottom-0 left-0 right-0">
                    <div className="min-w-[300px] rounded-lg grid place-items-center grid-cols-1 grid-rows-1 p-4 w-[60%] max-w-[600px] mx-auto min-h-[300px] bg-white">
                        <img src={imgSrc ? URL.createObjectURL(imgSrc) : avatar} className="object-contain w-[200px] h-[200px] rounded-full" />
                    </div>
                    <FontAwesomeIcon color="white" size='3x' className="fixed cursor-pointer top-[2rem] right-[2rem]" icon={faClose} onClick={() => { setShowingImages(false) }} />
                </div>
            )}
        </form>
    )
}

export default AlreadyLoggedGuard(Registration)
