import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { googleSignin, loginUser } from '../services/user-service'
import { useAuth } from '../context/AuthContext'
import AlreadyLoggedGuard from '../guards/AlreadyLoggedguard'
import Spinner from './Spinner'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { IToken, Gender } from '../@Types'

function Login() {
  const { setToken } = useAuth()
  const [loading, setLoading] = useState(false)

  // ✅ חדש: gender לשימוש ב-Google (חובה אם זה משתמש חדש)
  const genderRef = useRef<HTMLSelectElement>(null)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data: any = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries())

    try {
      const token = await loginUser(data["email"], data["password"])
      if (token?.accessToken) {
        localStorage.setItem('token', JSON.stringify(token))
        setToken(token)
        toast.success("התחברת בהצלחה!")
      } else {
        toast.error("שגיאה לא מוכרת צצה, אנא נסה שוב מאוחר יותר:)")
      }
    } catch (e: any) {
      toast.error("המייל או הסיסמה שהוזנו אינם נכונים.")
    }

    setTimeout(() => setLoading(false), 2000)
  }

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const gender = (genderRef.current?.value ?? "") as Gender
    if (gender !== "male" && gender !== "female") {
      toast.error("כדי להתחבר/להירשם עם Google חובה לבחור מין")
      return
    }

    try {
      const res = await googleSignin(credentialResponse, gender)
      if (res.accessToken) {
        const t: IToken = {
          accessToken: res.accessToken,
          refreshToken: res.refreshToken ?? "",
        }
        localStorage.setItem('token', JSON.stringify(t))
        setToken(t)
        toast.success("!התחברת בהצלחה")
      } else {
        toast.error("(:שגיאה לא מוכרת צצה, אנא נסה שוב מאוחר יותר")
      }
    } catch (e: any) {
      // אם זה משתמש חדש ולא נשלח gender - הבאק יחזיר 400
      toast.error("שגיאה בהתחברות עם Google")
    }
  }

  const onGoogleLoginFailure = () => {
    console.log("Google login failed")
  }

  return (
    <form onSubmit={login} className="vstack gap-3 col-md-7 mx-auto w-[80%] max-w-[500px]">
      <br />
      <h1 className='text-center p-2 font-bold text-[32px]'>התחברות</h1>

      <div className="form-floating">
        <input type="email" name="email" className="form-control" id="floatingInput" placeholder="" />
        <label htmlFor="floatingInput">אימייל</label>
      </div>

      <div className="form-floating">
        <input type="password" name="password" className="form-control" id="floatingPassword" placeholder="" />
        <label htmlFor="floatingPassword">סיסמה</label>
      </div>

      <button
        style={{ background: loading ? "gray" : "white" }}
        disabled={loading}
        className="text-black bg-[white] border-[1px] border-[black] mx-auto max-w-[100px] w-[50%] font-bold text-[20px] hover:opacity-[0.8] px-4 py-2 rounded-full flex items-center justify-center"
        type="submit"
      >
        התחבר
      </button>

      <div className="form-floating">
        <select ref={genderRef} className="form-control" id="floatingGenderLogin" defaultValue="">
          <option value="" disabled>בחרי מין (ל-Google)</option>
          <option value="female">נקבה</option>
          <option value="male">זכר</option>
        </select>
        <label htmlFor="floatingGenderLogin">מין (ל-Google)</label>
      </div>

      <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />

      {loading && <Spinner spinnerSize='lg' />}
    </form>
  )
}

export default AlreadyLoggedGuard(Login)
