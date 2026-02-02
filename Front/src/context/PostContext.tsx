import React, { useEffect, useState } from "react";
import { IComment, ICommentWithUser, IPost, IPostWithOwner, IUser } from "../@Types";
import * as postService from "../services/post-service";
import { useAuth } from "./AuthContext";
export interface IPostContext {
    posts: IPostWithOwner[],
    activePost: IPost | null
    sortedPosts: IPostWithOwner[],
    openActivePost: <T extends IPost>(post: T) => void
    closeActivePost:  () => void
    updatePostOwner: (owner: IUser) => void
    addPost: (post: Partial<IPost>, imageFile?: File) => Promise<IPostWithOwner| null>
    deletePost: (postId: string) => Promise<IPostWithOwner | null>
    editPost: (post: Partial<IPost>, imageFile?: File) => Promise<IPostWithOwner | null>
    deleteComment: (postId:string) => Promise<IComment | null>
    addComment : (postId:string, comment: Partial<IComment>) => Promise<ICommentWithUser | null>
}

const PostContext = React.createContext<IPostContext | null>(null)

export function normalizePosts<T extends IPost>(posts: T[] ) {
   return posts.map(p => {
        p['date_end'] = new Date(p['date_end'])
        p['date_start'] = new Date(p['date_start'])
        p["created_at"] = new Date(p["created_at"])
        return p
    })
}

export const PostContextProvider = ({children} : {children: React.ReactNode}) => {
    const [posts, setPosts] = useState<IPostWithOwner[]>([])
    const [activePost, setActivePost] = useState<IPost | null>(null)
    const {user, setUser} = useAuth()

    useEffect(() => {
        const fetchPosts = async () => {
                try {
                    const res = (await postService.getAllPosts()).res
                    if(res.data) {
                        const posts = res.data
                        setPosts(normalizePosts(posts))
                    }
                } catch(e) {
                    console.error(e)    
                }
        }
        fetchPosts()
    }, [])

    useEffect(() => { 
        if(posts && posts.length > 0) {
            setSortedPosts(posts.sort((p1, p2) => {
                if(p2.created_at && p1.created_at)
                    return p2.created_at.getTime() - p1.created_at.getTime()
                return 0
            }))
        }
    }, [posts])

    const [sortedPosts,setSortedPosts] = useState<IPostWithOwner[]>([])


    const updatePostOwner = (owner: IUser) => {
          setPosts(posts.map(p => {
            if(p.owner._id === owner._id) {
                p.owner = owner
            }
            return p
          }))  
    }
    const addComment = async (postId:string, comment: Partial<IComment>) => {
        try {
           const res = (await postService.addComment(postId, comment)).res
           if(res.data) {
            const posted = res.data
            setPosts(posts.map(post => post._id === postId ? {...post, comments: [...post.comments, res.data]}: post))

            const foundPost = user?.posts.find(p => p._id === postId)
            if(foundPost && user) {
                setUser({...user, posts: user.posts.map(p => {
                    if(p._id === foundPost._id) {
                        return {...p, comments:[...p.comments, res.data]}
                    }
                    return p
                })})
            }
            return posted
           }
        } catch(e) {
            console.error(e)
        }   
        return null
    }
    const deleteComment = async (commentId:string) => {
        try {
           const res = (await postService.deleteComment(commentId)).res
           if(res.data) {
            const posted = res.data
            setPosts(posts.map(post => post._id === res.data.post ? {...post, comments: post.comments.filter(c => c._id !== commentId)}: post))
            return posted
           }
        } catch(e) {
            console.error(e)
        }   
        return null
    }

    const addPost = async (post: Partial<IPost>, imageFile?: File) => {
        try {
           const res = (await postService.addPost(post, imageFile)).res
           if(res.data) {
            const posted = res.data
            setPosts(normalizePosts([...posts, posted]))
            if(user)
                setUser({...user, posts:normalizePosts([...user.posts, posted] as any)})
            return posted
           }
        } catch(e) {
            console.error(e)
        }   
        return null
    }

    const editPost = async (post: Partial<IPost>, imageFile?: File) => {
        try {
        
           const res = (await postService.editPost(post, imageFile)).res
           if(res.data) {
            const posted = res.data
            setPosts(normalizePosts(posts.map(p => p._id === post._id ? res.data :p)))
            if(user)
                setUser({...user, posts: normalizePosts(user.posts.map(p => p._id === post._id ? res.data :p) as any)})
            return posted
           }
        } catch(e) {
            console.error(e)
        }   
        return null
    }
     
    const deletePost = async (postId: string) => {
        try {
           const res = (await postService.deletePost(postId)).res
           if(res.data) {
                const deleted = res.data
                setPosts(normalizePosts(posts.filter(p => p._id !== postId)))
                if(user)
                    setUser({...user, posts: normalizePosts(user.posts.filter(p => p._id !== postId ) as any)})
                return deleted
           }
        } catch(e) {
            console.error(e)
        }   
        return null
    }

    function openActivePost<T extends IPost>(p: T) {
        setActivePost(p)
    }
    function closeActivePost() {
        setActivePost(null)
    }
    

    return <PostContext.Provider value={{
         posts, 
         sortedPosts,
         activePost,
         updatePostOwner,
         addPost,
         deletePost,
         editPost,
         addComment,
         deleteComment,
         openActivePost,
         closeActivePost,
        }}>
        {children}
    </PostContext.Provider>
}
export const usePosts = () => {

    const context = React.useContext(PostContext)
    if(!context) {
        throw new Error("Post context not provided")
    }
    return context
}