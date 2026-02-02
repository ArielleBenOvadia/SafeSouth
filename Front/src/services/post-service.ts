import  { CanceledError } from "axios"
import axios from 'axios'
import { IComment, ICommentWithUser, IPost, IPostWithOwner } from "../@Types"
import { uploadPhoto } from "./file-service"

export { CanceledError }
const getAllPosts = async () => {
    const abortController = new AbortController()
    const req = axios.get<IPostWithOwner[]>('post', { signal: abortController.signal })
    return { res: await req, abort: () => abortController.abort() }
}

const addPost = async (post: Partial<IPost>, imageFile?: File) => {
    const abortController = new AbortController()
    if(imageFile) {
        imageFile.type
        const url = await uploadPhoto(imageFile, post.title + ".jpg")
        post.imgUrl = url
    } 
    const req = axios.post<IPostWithOwner>('post', post , { signal: abortController.signal })
    return { res: await req, abort: () => abortController.abort() }
}

const editPost = async (post: Partial<IPost>, imageFile?: File) => {
    const abortController = new AbortController()
    if(imageFile) {
        imageFile.type
        const url = await uploadPhoto(imageFile, post.title + ".jpg")
        post.imgUrl = url
    } 
    const req = axios.put<IPostWithOwner>(`post/${post._id}`, post , { signal: abortController.signal })
    return { res: await req, abort: () => abortController.abort() }
}
const deletePost = async (postId:string) => {
    const abortController = new AbortController()
    const req = axios.delete<IPostWithOwner>(`post/${postId}` , { signal: abortController.signal })
    return { res: await req, abort: () => abortController.abort() }
}


const addComment = async (postId:string, comment: Partial<IComment>) => {
    const abortController = new AbortController()
    const req = axios.post<ICommentWithUser>(`postComment/${postId}`, comment , { signal: abortController.signal })
    return { res: await req, abort: () => abortController.abort() }
}

const deleteComment = async (commentId: string) => {
    const abortController = new AbortController()
    const req = axios.delete<IComment>(`postComment/${commentId}` , { signal: abortController.signal })
    return { res: await req, abort: () => abortController.abort() }
}

export { getAllPosts, deleteComment, addComment, addPost, editPost, deletePost }