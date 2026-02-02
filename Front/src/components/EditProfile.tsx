import { ChangeEvent, useRef, useState } from 'react'
import avatar from '../assets/avatar_pic.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { uploadPhoto } from '../services/file-service'
import {faClose} from '@fortawesome/free-solid-svg-icons';

import { registrUser, googleSignin, editUser } from '../services/user-service'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import AlreadyLoggedGuard from '../guards/AlreadyLoggedguard'
import { IUser } from '../@Types'
import Spinner from './Spinner'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import AuthorizedGuard from '../guards/AuthorizedGuard'
import { normalizePosts, usePosts } from '../context/PostContext'

function EditProfile() {
    const [imgSrc, setImgSrc] = useState<File>()
    const [loading,setLoading] = useState(false)
    const nav = useNavigate()
    const {updatePostOwner} = usePosts()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const passwordInputRef = useRef<HTMLInputElement>(null)
    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0])
        }
    }
    const selectImg = () => {
        console.log("Selecting image...")
        fileInputRef.current?.click()
    }

    const edit = async () => {
        if(!currentUser) return
        if (firstNameRef?.current?.value && lastNameRef?.current?.value) {
            let url : string | undefined  = ""
            if(imgSrc) {
                url = await uploadPhoto(imgSrc!);
            }else {
                url = currentUser.imgUrl
            }
            let pass = '';
            if(passwordInputRef.current?.value && passwordInputRef.current?.value?.length > 0) {
                pass = passwordInputRef.current?.value
            } else {
                pass = currentUser.password
            }
            const user: IUser = {
                email: currentUser.email, 
                password: pass ,
                first_name: firstNameRef.current?.value,
                last_name: lastNameRef.current?.value,
                imgUrl: url,
                posts:currentUser.posts.map(p => p._id),
            }
            const res = await editUser(user, pass !== currentUser.password)
            if(res) {
                updatePostOwner(res)
                setUser({...res, posts: normalizePosts(res.posts)})
                nav("/login")
                toast.success("(:!הפרטים נשמרו בהצלחה")
            }
        } else {
            toast.error("(:אנא מלא את כל השדות ובחר תמונת פרופיל")
        }
    }

    const {user: currentUser, setUser} = useAuth()
    const [showingImages, setShowingImages] = useState(false)
    return (
        <form className="vstack gap-3 col-md-7 mx-auto">
            <h1 className='text-center p-2 font-bold text-[32px]'>עריכת פרופיל</h1>
            <div className="d-flex justify-content-center position-relative">
                <img onClick={() => {
        if(imgSrc || currentUser?.imgUrl) {
            setShowingImages(true)
        }
       }} src={(imgSrc ? URL.createObjectURL(imgSrc) : currentUser?.imgUrl ) ?? avatar} style={{ height: "230px", width: "230px" }} className="object-contain" />
                <button type="button" className="btn position-absolute bottom-0 end-0" onClick={selectImg}>
                    <FontAwesomeIcon icon={faImage} className="fa-xl" />
                </button>
            </div>

            <input style={{ display: "none" }} required ref={fileInputRef} type="file" onChange={imgSelected}></input>
            <div className="form-floating">
                <input ref={firstNameRef} defaultValue={currentUser?.first_name} required type="text" className="form-control" id="floatingInput" placeholder="" />
                <label htmlFor="floatingInput">שם פרטי</label>
            </div>

            <div className="form-floating">
                <input ref={lastNameRef} defaultValue={currentUser?.last_name} required type="text" className="form-control" id="floatingInput" placeholder="" />
                <label htmlFor="floatingInput">שם משפחה</label>
            </div>

            <div className="form-floating">
                <input ref={passwordInputRef} type="password" className="form-control" id="floatingPassword" placeholder="" />
                <label htmlFor="floatingPassword">סיסמה</label>
            </div>
            <button  style={{background: loading ? "gray" : "white", color:'black'}} disabled={loading} type="button"
             className=" bg-[var(--color-green-light-2)] font-bold text-[20px] hover:opacity-[0.8] p-2 rounded-md" onClick={edit}>שמור פרטים</button>

            {loading && <Spinner spinnerSize='lg'/>}
            {showingImages  &&<div className="fixed bg-[rgba(0,0,0,0.5)] grid items-center top-0 bottom-0 left-0 right-0">
                <div className="min-w-[300px] rounded-lg grid place-items-center grid-cols-1 grid-rows-1 p-4 w-[60%] max-w-[600px] mx-auto min-h-[300px] bg-white">
                    <img src={(imgSrc ? URL.createObjectURL(imgSrc) : currentUser?.imgUrl) ?? avatar} className="object-contain w-[200px] h-[200px] rounded-full" alt="No provided"/>
                </div>
                <FontAwesomeIcon color="white" size='3x' className="fixed cursor-pointer top-[2rem] right-[2rem]" icon={faClose} onClick={() => {setShowingImages(false)}}/>
      
                </div>} 
        </form>)
}

export default AuthorizedGuard(EditProfile)