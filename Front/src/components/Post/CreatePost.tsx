import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from '@fortawesome/free-solid-svg-icons'
import React, { ChangeEvent, useMemo, useRef, useState } from "react";
import avatar from '../../assets/avatar_pic.png'
import { Gender, IPost } from "../../@Types";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import AuthorizedGuard from "../../guards/AuthorizedGuard";
import { useNavigate, useParams } from "react-router";
import { usePosts } from "../../context/PostContext";
import { useAuth } from "../../context/AuthContext";
import completions from "../../services/completions";

export const dateToString = (date: Date | undefined, rev: boolean = false) => {
    if (!date) return undefined
    let m = ("0" + (date.getMonth() + 1)).slice(-2)
    let d = ("0" + date.getDate()).slice(-2)
    if (rev) return `${d}-${m}-${date.getFullYear()}`
    return `${date.getFullYear()}-${m}-${d}`
}

function CreatePost() {
    const { existingPostId } = useParams()
    const nav = useNavigate()
    const { user } = useAuth()
    const [imgSrc, setImgSrc] = useState<File | undefined>()
    const [loading, setLoading] = useState(false)
    const { addPost, posts, editPost } = usePosts() // אזור באפליקציה שמתקשר עם הסרויס
    const capacityRef = useRef<HTMLInputElement | null>(null)
    const locationREf = useRef<HTMLInputElement | null>(null)
    const contentRef = useRef<HTMLTextAreaElement | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const existingPost = useMemo(() => posts?.find(p => p._id === existingPostId), [existingPostId, posts])

    const selectImg = () => fileInputRef.current?.click()

    const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImgSrc(e.target.files[0])
        }
    }

    async function onSubmitPost(e: React.FormEvent) {
        e.preventDefault()
        if (!user?.first_name || !user.last_name || user.first_name.length <= 0 || user.last_name.length <= 0) {
            toast.info("יש לערוך פרטים אישיים בעמוד פרופיל על מנת לפרסם פוסט")
            return;
        }
        setLoading(true)

        const data: any = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries())
        data["kosher_home"] = data["kosher_home"] === 'on'
        data["animals_home"] = data["animals_home"] === 'on'
        data["shabat_save"] = data["shabat_save"] === 'on'
        data["handicap_home"] = data["handicap_home"] === 'on'
        delete data["imgSrc"]

        try {
            const newPost: IPost = { ...data, imgUrl: imgSrc } as any

            if (existingPost) {
                newPost._id = existingPost._id
                const res = await editPost(newPost, imgSrc)
                if (res) {
                    toast.success("!הפוסט נשמר בהצלחה")
                    nav("/")
                } else {
                    toast.error(".אנא מלא את כל השדות ונסה שנית")
                }
            } else {
                const res = await addPost(newPost, imgSrc)
                if (res) {
                    toast.success("!הפוסט פורסם בהצלחה")
                    nav("/")
                } else {
                    toast.error(".אנא מלא את כל השדות ונסה שנית")
                }
            }
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setLoading(false)
        }
    }

    const [generatedPost, setGeneratedPost] = useState<string | undefined>()
    const [loadingChat, setLoadingChat] = useState(false)

    const generateAiDrivenPost = async () => {
        if (loadingChat) return;

        const location = locationREf.current?.value
        const capacity = capacityRef.current?.value
        const name = user?.first_name
        const gender = user?.gender as Gender | undefined

        if (
            location === undefined || capacity === undefined || name === undefined ||
            location.length < 1 || name.length < 1
        ) {
            toast.info(".יש להכניס כמות אורחים אפשרית ומיקום, לפני יצירת פוסט באמצעות בינה מלאכותית")
            return;
        }

        if (!gender) {
            toast.info("כדי ליצור פוסט בלשון נכונה, יש לבחור מין בעמוד עריכת פרופיל")
            nav("/edit-profile")
            return;
        }

        setLoadingChat(true)
        try {
            const comps = await completions(name, location, capacity, gender)
            if (comps) setGeneratedPost(comps)
        } catch (e) {
            toast.info(".יצירת תוכן פוסט באמצעות הבינה המלאכותית נכשלה, אנא נסה שוב מאוחר יותר")
        } finally {
            setLoadingChat(false)
        }
    }

    return (
        <form onSubmit={onSubmitPost} dir="rtl" className="gap-3 justify-start mb-[4rem] flex flex-col items-center mx-auto w-[80%] max-w-[500px]">
            <br />
            <h1 className='text-center p-2 font-bold text-[32px]'>
                {existingPost ? "עריכת פוסט" : "פוסט חדש"}
            </h1>

            <span className="flex flex-col items-start gap-4">
                <div className="flex flex-row items-center justify-start w-[300px] gap-2">
                    <label dir="rtl" htmlFor="floatingLocation-7">אזור מגורים:</label>
                    <input ref={locationREf} defaultValue={existingPost?.location} type="text" name="location" required className="outline-none border-none" id="floatingLocation-7" />
                </div>

                <div className="flex flex-row justify-start gap-4">
                    <div className="flex flex-row items-center justify-start w-[300px] gap-2">
                        <label dir="rtl" htmlFor="floatingInput-3">יכול לארח מהתאריך:</label>
                        <input type="date" defaultValue={dateToString(existingPost?.date_start)} name="date_start" required className="outline-none border-none" id="floatingInput-3" />
                    </div>

                    <div className="flex flex-row items-center justify-start w-[300px] gap-2">
                        <label dir="rtl" htmlFor="floatingInput-4">עד התאריך:</label>
                        <input type="date" defaultValue={dateToString(existingPost?.date_end)} name="date_end" required className="outline-none border-none" id="floatingInput-4" />
                    </div>
                </div>

                <div className="flex flex-row items-center justify-start w-[300px] gap-2">
                    <label dir="rtl" htmlFor="floatingInput-17">מספר טלפון ליצירת קשר:</label>
                    <input type="tel" defaultValue={existingPost?.post_owner_phone} name="post_owner_phone" required className="outline-none border-none" id="floatingInput-17" />
                </div>

                <div className="flex flex-row items-center justify-start w-[300px] gap-2">
                    <label dir="rtl" htmlFor="floatingInput-16">אימייל:</label>
                    <input type="email" defaultValue={existingPost?.post_owner_email} name="post_owner_email" required className="outline-none border-none" id="floatingInput-16" />
                </div>

                <div className="flex flex-row items-center gap-2">
                    <label dir="rtl" htmlFor="floatingInput-1">כותרת הפוסט:</label>
                    <input type="text" defaultValue={existingPost?.title} name="title" required className="outline-none border-none" id="floatingInput-1" />
                </div>

                <div className="flex flex-row items-center gap-2">
                    <label dir="rtl" htmlFor="floatingInput-1b">מספר אורחים אפשרי:</label>
                    <input type="number" ref={capacityRef} defaultValue={existingPost?.capacity} name="capacity" required className="outline-none border-none" id="floatingInput-1b" />
                </div>
            </span>

            <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-row items-start gap-2 justify-start">
                    <input type="checkbox" defaultChecked={existingPost?.kosher_home} name="kosher_home" className="form-check-input" id="floatingLocation-8" />
                    <label dir="rtl" htmlFor="floatingLocation-8">בית שומר כשרות.</label>
                </div>
                <div className="flex flex-row items-start gap-2 justify-start">
                    <input type="checkbox" defaultChecked={existingPost?.shabat_save} name="shabat_save" className="form-check-input" id="floatingLocation-9" />
                    <label dir="rtl" htmlFor="floatingLocation-9">בית שומר שבת.</label>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-row items-start gap-2 justify-start">
                    <input type="checkbox" defaultChecked={existingPost?.animals_home} name="animals_home" className="form-check-input" id="floatingLocation-10" />
                    <label dir="rtl" htmlFor="floatingLocation-10">ידידותי לחיות מחמד.</label>
                </div>
                <div className="flex flex-row items-start gap-2 justify-start">
                    <input type="checkbox" defaultChecked={existingPost?.handicap_home} name="handicap_home" className="form-check-input" id="floatingLocation-11" />
                    <label dir="rtl" htmlFor="floatingLocation-11">בית נגיש לנכים.</label>
                </div>
            </div>

            <div className="flex flex-row items-center justify-start gap-4 ml-[-12rem]">
                <div className="flex flex-col items-center gap-2">
                    <label dir="rtl" htmlFor="floatingInput-2">תוכן הפוסט:</label>
                    <textarea
                        ref={contentRef}
                        defaultValue={existingPost?.message}
                        name="message"
                        required
                        className="outline-none border-none min-h-[100px] max-h-[100px] bg-[lightgray] rounded-lg min-w-[350px] px-4"
                        dir="rtl"
                        id="floatingInput-2"
                    />

                    <button
                        style={{ background: loading ? "gray" : "white" }}
                        disabled={loading}
                        className="text-black bg-[white] border-[1px] mt-[.5rem] border-[black] mx-auto max-w-[300px] w-[50%] font-bold text-[20px] hover:opacity-[0.8] px-4 py-2 rounded-full flex items-center justify-center"
                        type="submit"
                    >
                        {existingPost ? "שמור פוסט" : "פרסם פוסט"}
                    </button>

                    <button onClick={generateAiDrivenPost} type="button" className="text-[13px] border-[1px] border-[gray] p-2 rounded-full mt-2">
                        יצירת תוכן פוסט מונע בינה מלאכותית
                    </button>
                </div>

                <div className="flex flex-col gap-2 max-w-[180px] mb-[62px] text-center self-end">
                    <label dir="rtl">הוסף תמונה של אזור האירוח</label>
                    {(imgSrc || existingPost?.imgUrl) && (
                        <img
                            src={(imgSrc ? URL.createObjectURL(imgSrc) : existingPost?.imgUrl) ?? avatar}
                            style={{ height: "230px", width: "230px", objectFit: 'contain' }}
                        />
                    )}
                    <button type="button" className="btn bottom-0 end-0" onClick={selectImg}>
                        <FontAwesomeIcon icon={faImage} className="fa-xl" />
                    </button>
                </div>
            </div>

            <input style={{ display: "none" }} name="imgSrc" ref={fileInputRef} type="file" onChange={imgSelected} />

            {loading && <Spinner spinnerSize='lg' />}

            {loadingChat && (
                <div className="w-fit mx-auto flex flex-col items-center">
                    <Spinner spinnerSize='lg' />
                    <span>מכין תוכן פוסט...</span>
                </div>
            )}

            {generatedPost && (
                <div>
                    <h2 className="w-fit mx-auto text-center font-bold text-underline">תוכן פוסט מונע בינה מלאכותית</h2>
                    <p className="p-2 max-w-[400px] max-h-[400px] overflow-y-scroll text-center">
                        {generatedPost}
                    </p>
                    <button
                        onClick={() => {
                            if (contentRef.current) contentRef.current.value = generatedPost
                            setGeneratedPost(undefined)
                        }}
                        className="border-[1px] border-black p-2 w-max"
                    >
                        קבע כתוכן פוסט
                    </button>
                </div>
            )}
        </form>
    )
}

export default AuthorizedGuard(CreatePost)
