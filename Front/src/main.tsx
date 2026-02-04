import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { PostContextProvider } from './context/PostContext.tsx'
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = "http://localhost:3001"

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if(token) { 
    const {accessToken} = JSON.parse(token)
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
  return config
})

const tokenExpiredInterceptor = async (config: AxiosError) => {
    if(config.response?.status === 401 && config.response?.data === 'jwt expired') {
      const token = JSON.parse(localStorage.getItem('token') ?? "null")
      if(token) {
          // possibly call refreshToken()
          try {
          localStorage.removeItem('token') // remove expired token
          const newToken = await fetch("http://localhost:3001/auth/refresh", {
            headers: {
              'Content-Type': "application/json",
              'Authorization': `Bearer ${token.refreshToken}`
            }
          }).then(r => r.json())
          console.log("NEW TOKEN: " + JSON.stringify(newToken))
          localStorage.setItem("token", JSON.stringify(newToken))
          window.location.reload()
        } catch(e) {
          alert("Session expired, please re-login")
        }
      }
    }
  return config
}

axios.interceptors.response.use( response => response, tokenExpiredInterceptor)


ReactDOM.createRoot(document.getElementById('root')!).render(

  <GoogleOAuthProvider clientId="330327326922-t7m250jn2epuq62c1b224nv4621toq00.apps.googleusercontent.com">
     <BrowserRouter>
     <AuthContextProvider>
      <PostContextProvider>
        <App />
      </PostContextProvider>
     </AuthContextProvider>
     </BrowserRouter>
  </GoogleOAuthProvider>
)