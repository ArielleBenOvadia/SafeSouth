import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../Spinner"
import {toast} from 'react-toastify';

import {Modal} from 'antd'
const navBarStyle = "p-4 bg-white flex flex-row items-center justify-between border-[1px] border-[lightgray]"
export default function Navbar() {


    const {user,loading,logOut} = useAuth()
    const {pathname} = useLocation()
    const AuthButtons = useCallback(() => {
        if(loading) {
            return <Spinner spinnerSize="sm"/>
        }
        if(!user) {
            return <div className="flex flex-row gap-2">
                 <Link to="/login" className="text-black font-bold">התחבר</Link>
                 <Link to="/register" className="text-black font-bold">הירשם</Link>
            </div>
        }
        if(user) {
            return <div className="flex flex-row gap-4 items-center">
                 {pathname.includes("profile") ? 
                  <Link to="/edit-profile" className="text-black font-bold">עריכת פרופיל</Link> 
                  : <Link to="/profile" className="text-black font-bold">פרופיל</Link>
        }
                 <div className="text-black" onClick={() => {
                    Modal.confirm({
                        title: "Safe South",
                        okButtonProps: {className:'bg-blue-500'},
                        content:"האם הינך בטוח שברצונך להתנתק?",
                        onOk: () =>  {
                            logOut()
                            toast.info("!נותקת בהצלחה")
                        },
                    })
                 }}>התנתק</div>
            </div>
        }
    }, [user, loading,pathname])

   return  <nav className={navBarStyle}>
    <Link to="/" className=" text-[black]">
        SafeSouth
    </Link>
    <div>
        <AuthButtons/>
    </div>
   </nav>
}