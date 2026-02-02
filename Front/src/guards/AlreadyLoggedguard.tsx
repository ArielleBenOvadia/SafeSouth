import { FunctionComponent } from "react";
import { useAuth } from "../context/AuthContext";
import {  Navigate } from "react-router-dom";


export default function AlreadyLoggedGuard<T>(
    Component: FunctionComponent<T>
){
    return function useGuard(props: T) {
        const { user, loading } = useAuth()
        if(user && !loading) {
            return <Navigate to="/"/>
        }
        return <Component {...props as any}/>
    }
}