

import Registration from "./pages/Registration"
import {Routes, Route, Navigate} from 'react-router-dom'
import Feed from "./pages/Feed"
import {ToastContainer} from 'react-toastify'
import Login from "./pages/Login"
import Navbar from "./components/navBar/Navbar"
import CreatePost from "./components/Post/CreatePost"
import { useAuth } from "./context/AuthContext"
import { useCallback, useEffect } from "react"
import Welcome from "./pages/Welcome"
import Profile from "./pages/Profile"

import logo from './assets/logo.png'
import PostComments from "./components/Post/PostComments"
import PostPage from "./components/Post/PostPage"
import EditProfile from "./pages/EditProfile"
import completions from "./services/completions"

const Logo = () => {
  return <img src={logo} className="mx-auto my-4"/>
}
function App() {
  const {user} = useAuth()

  const HomeComponent = useCallback(() => {
    if(user) {
      return <Navigate to="/feed"/>
    }
    return <Welcome/>
  },[user])

 
  return (
    <div>
      <Navbar/>
      <Logo/>
      <PostComments/>
      <Routes>
        <Route index element={<HomeComponent/>}/>
        <Route path="/feed"  element={<Feed/>}/>
        <Route path="/register"  element={<Registration/>}/>
        <Route path="/profile"  element={<Profile/>}/>
        <Route path="/edit-profile"  element={<EditProfile/>}/>
        <Route path="/post-page/:id"  element={<PostPage/>}/>
        <Route path="/login"  element={<Login/>}/>
        <Route path="/create-post/:existingPostId"  element={<CreatePost/>}/>
      </Routes>
      <ToastContainer/>
    </div>
  )
}


export default App