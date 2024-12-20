import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation, HashRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import Layout from './Layout/layout';



// const CreatePost = React.lazy(() => import("./components/Feed/CreatePost"));
const Login = React.lazy(() => import("./Pages/Login/login"));
const UserFeed = React.lazy(() => import("./Pages/Feed/Feed"));
const ProfilUser = React.lazy(() => import("./Pages/Profile/profile"));
const EditProfile = React.lazy(()=>import("./Pages/Profile/editprofile"));
const CreatePost = React.lazy(()=>import("./Pages/CreatePost/MediaPicker"));
const PreviewScreen = React.lazy(()=>import("./Pages/CreatePost/PreviewScreen"));
export default function App() {

  return (
    <div>
      <ThemeProvider children={undefined}>
        <HashRouter>
        <Suspense fallback={<div className='loader-center'><div className='loader'></div></div>}>
          <Routes>
            <Route index path='/' element={<Login />} />
            <Route element={<Layout />}>
              <Route path='/Feed' element={<UserFeed />} />
              <Route path='/profile' element={<ProfilUser />}/>
              <Route path='/editProfile' element={<EditProfile />}/>
              <Route path='/CreatePost' element={<CreatePost/>} />
              <Route path='/PreviewScreen' element={<PreviewScreen/>}/>
            </Route>
          </Routes>
          </Suspense>
        </HashRouter>
      </ThemeProvider>
    </div>
  )
}

