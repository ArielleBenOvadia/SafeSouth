import { useMemo, useState } from "react";
import { IComment } from "../../@Types";
import {faClose} from '@fortawesome/free-solid-svg-icons';
import { usePosts } from "../../context/PostContext";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateToString } from "./CreatePost";

export function CommentList2<T extends IComment[]>({comments} : {comments: T}) {
    return  <div className="max-h-[400px] py-[1rem] w-[70%]  px-[1rem] max-w-[400px] no-scrollbar min-w-[200px] overflow-y-scroll">
     {comments.map(comment => 
     <div key={comment._id} className="p-2">
      {typeof comment.comment_owner === 'object' && <span> {comment.comment_owner.first_name + " " + comment.comment_owner.last_name}</span>}
     <p className="rounded-full p-2 bg-[lightgray]">{comment.message}</p>
     </div>)}
 </div>
}
// a note for me


export default function PostPage() {
    const  {posts} = usePosts()

    const [showingImages,setShowingImages] = useState(false)
    const {id} = useParams()
    const post = useMemo(() => posts.find(p => p._id===id), [id,posts])
    if(!post) return <div>Post not found</div>
    return (
        <div className="p-2 w-fit mx-auto flex flex-col items-center" style={{ textAlign: 'right' }}>

            <img src={post.owner.imgUrl} className="w-[100px] object-contain h-[100px] rounded-full" alt="No provided"/>
            <div>
    {post.owner.first_name + "  " + post.owner.last_name}
</div>
<div style={{ height: '2rem' }} /> {/* Space of one line */}
<div className="flex flex-col items-center justify-center h-full max-w-[500px] max-h-[500px]">
    <h1 className="max-w-[500px] mx-auto text-center font-bold"> {/* Apply bold font style */}
        {post.title}
    </h1>
    <p className="text-center"> {/* Remove the inline color style */}
        {post.message}
    </p>
    <p className="w-max text-center font-bold"> {/* Apply bold font style */}
        {post.location}, תאריכים: &nbsp; {dateToString(post.date_start, true)} - {dateToString(post.date_end,true)}
    </p>
</div>


          <br/>
          <div className="flex flex-row items-center gap-4">
          <div>פרטים:</div>
            <div className=" text-gray grid grid-cols-2 gap-2">
                <div className="flex gap-2">
                    <label className="flex flex-row items-center gap-2">
                        <input type="checkbox" checked={post.handicap_home} disabled />
                       <span> בית נגיש לנכים.</span>
                    </label>
                </div>
                <div className="flex">
                    <label className="flex flex-row items-center gap-2">
                        <input type="checkbox" checked={post.animals_home} disabled />
                       <span> מקבלים חיות מחמד.</span>
                    </label>
                </div>
                <div className="flex">
                    <label className="flex flex-row items-center gap-2">
                        <input type="checkbox" checked={post.kosher_home} disabled />
                        <span>בית שומר כשרות.</span>
                    </label>
                </div>
                <div className="flex-grow-1">
                    <label className="flex flex-row items-center gap-2">
                        <input type="checkbox" checked={post.shabat_save} disabled />
                        <span>בית שומר שבת.</span>
                    </label>
                </div>
            </div>
            </div>
            <br/>
            <div dir="rtl">
                יכולים לארח עד: &nbsp;&nbsp; {post.capacity ?? 1} &nbsp;&nbsp;נפשות.
            </div>
            <div>
                טלפון: &nbsp;&nbsp; {post.post_owner_phone}
            </div>
            <b className="pt-5">
            <div>תגובות</div>
            </b>
            <button className="border-[1px] translate-x-[-72px] border-[gray] rounded-full p-2 self-end " onClick={() => {
                const defaultImage = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                if(post.imgUrl ===defaultImage ) {
                    toast.info(".לפוסט זה אין תמונות")
                    return;
                }
                setShowingImages(true)
            }}>תמונות</button>
            <CommentList2 comments={post.comments}/>
            {showingImages && <div className="fixed bg-[rgba(0,0,0,0.5)] grid items-center top-0 bottom-0 left-0 right-0">
                <div className="min-w-[300px] rounded-lg grid place-items-center grid-cols-1 grid-rows-1 p-4 w-[60%] max-w-[600px] mx-auto min-h-[300px] bg-white">
                    <img src={post.imgUrl} className="object-contain w-[200px] h-[200px] rounded-full" alt="No provided"/>
                </div>
                <FontAwesomeIcon color="white" size='3x' className="fixed cursor-pointer top-[2rem] right-[2rem]" icon={faClose} onClick={() => {setShowingImages(false)}}/>
      
            </div>}          
        </div>      
    );
}
