import React, { ReactNode, useEffect, useState } from "react";
import { IToken, IUserWithPosts } from "../@Types";
import axios from "axios";

export interface IAuthContext {
    loading: boolean
    setLoading: (b: boolean) => void
    user: IUserWithPosts | null
    token: IToken | null
    setUser: (user: IUserWithPosts) => void
    setToken: (token: IToken) => void
    logOut: () => void
}

const AuthContext = React.createContext<IAuthContext | null>(null) 


export function AuthContextProvider({ children } : {children: ReactNode}) {

    const [user,setUser] = useState<IUserWithPosts | null>(null)
    const [loading,setLoading] = useState<boolean>(true)
    const [token,setToken] = useState<IToken | null>(null)
    useEffect(() => {
        const t = localStorage.getItem('token')
        if(t) {
            setToken(JSON.parse(t))
        }
    }, [])

    useEffect(() => {
        if(token) {
            setLoading(true)
            const fetchUser = async () => {
                try {
                    const res = await axios.get("/auth/me")
                    if(res.data) {
                        if(res.data.posts)
                            res.data.posts = res.data.posts.map((p: any) => {
                                p['date_end'] = new Date(p['date_end'])
                                p['date_start'] = new Date(p['date_start'])
                                return p
                            })
                        setUser(res.data as IUserWithPosts)
                    }
                }catch(e) {}
                finally {
                    setLoading(false)
                }
            }
            fetchUser()
         } else {
            setLoading(false)
        }
    },[token])


    const logOut = () => {
        setLoading(false)
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
    }

    return <AuthContext.Provider value={{
        token,
        setToken,
        user,
        setUser,
        loading,
        setLoading,
        logOut}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {

    const context = React.useContext(AuthContext)
    if(!context) {
        throw new Error("Auth context not provided")
    }
    return context
}