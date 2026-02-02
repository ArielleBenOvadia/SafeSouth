import { IPost, IPostWithOwner, IUser } from "../../@Types";
import {  faComment, faRemove, faEdit} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePosts } from "../../context/PostContext";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { useMemo } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { dateToString } from "./CreatePost";

export interface IPostProps<T extends IPost> {
    post: T
}

export default function Post<T extends IPost>({post}: IPostProps<T>) {
    const {openActivePost} = usePosts()
    const {user} = useAuth()
    const {deletePost} = usePosts()
    const nav = useNavigate()
    const {pathname} = useLocation()
    const isProfilePage =useMemo(() => pathname?.includes("profile"),[pathname])
    const isCurrentUserOwner = useMemo(() => user?._id === post.owner || (typeof post.owner === 'object' &&  user?._id === (post.owner as any)._id), [user, post])
    return (
        <div className="p-2 text-right rtl flex flex-row items-center gap-4" dir="rtl">
            
            {typeof post.owner === 'object' && <img  className="rounded-full object-contain w-[70px] min-w-[100px] max-w-[100px] h-[70px]" src={post.owner.imgUrl}/>}
            <div className="grid gap-[2px] w-full">
                <div>
                    {typeof post.owner === 'object' && post.owner.first_name + "  " + post.owner.last_name}
                </div>
                <h1>
                   
                    <p className="sm:w-[400px]  md:w-[400px] lg:w-[700px]">
                        {post.message}
                    </p>
                    <p className="text-[gray] w-max">
                        {post.location}, תאריכים: &nbsp; {dateToString(post.date_start, true)} - {dateToString(post.date_end, true)}
                    </p>
                </h1>

                <div className="flex items-center gap-2" onClick={() => {
                    openActivePost(post)
                }}>
                <FontAwesomeIcon icon={faComment}/>
                {post.comments.length ?
                <span>{post.comments.length} תגובות</span>
                : <span>אין תגובות</span>} 
                    </div>               
            </div>
            {!isProfilePage &&<div className="w-full text-start text-blue-500 text-[18px] cursor-pointer" onClick={() => nav(`/post-page/${post._id}`)}>
                        צפה בפוסט
            </div>}
          {isCurrentUserOwner && isProfilePage && <div>
            <div 
                onClick={() => nav(`/create-post/${post._id}`)}
                className="flex flex-row items-center gap-2">
            <FontAwesomeIcon icon={faEdit}/>
                <span>ערוך</span>
            </div>
            <div
            onClick={() => {
                Modal.confirm({
                    okButtonProps: {
                        className:'bg-blue-500'
                    },
                    content:"אתה בטוח שהינך רוצה למחוק את הפוסט?",
                    okText:"כן מחק",
                    onOk: async () => {
                        if(await deletePost(post._id)) {
                            toast.success(".הפוסט נמחק בהצלחה")
                        } else {
                            toast.error(".אירעתה שגיאה בעת מחיקת הפוסט, אנא נסה שוב מאוחר יותר")
                        }
                    }
                })
            }}
            className="flex flex-row items-center gap-2">
            <FontAwesomeIcon icon={faRemove}/>
                <span>מחק</span>
            </div>
          </div>}
        </div>
    );
}
