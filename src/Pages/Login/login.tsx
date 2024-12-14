import React, { useState } from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle } from '../../redux/Slice/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
// import toast, { Toaster } from 'react-hot-toast';


export default function Login() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    // toast(error);
    const handleGoogleLogin = async () => {
        const resultAction = await dispatch(loginWithGoogle());
        if (loginWithGoogle.fulfilled.match(resultAction)) {
            console.log("resultAction", resultAction);
            localStorage.setItem("username",resultAction?.payload?.username);
            localStorage.setItem("Email",resultAction?.payload?.Email);
            localStorage.setItem("profileImage",resultAction?.payload?.profileimage);
            localStorage.setItem("userId",resultAction?.payload?.data?.data?._id);
            navigate("/Feed",{
                replace: true
            });
        }
    };

    return (
        <div className='login'>
            {/* <Toaster
                position="top-center" /> */}
            <div className="desktop-message">
                <p>This application is designed exclusively for mobile and tablet devices. Please access it on a compatible device.</p>
            </div>
            <div className='login-wrapper'>
                <div className='login-image-conatiner'>
                    <div className='image-conatiner-1'>
                        <div className='image-wrapper'>
                            <img src={require("../../assets/girl.png")} className='login-img' />
                        </div>
                        <div className='image-wrapper'>
                            <img src={require("../../assets/purpuleflower.png")} className='login-img' />
                        </div>
                        <div className='image-wrapper'>
                            <img src={require("../../assets/handflower.png")} className='login-img' />
                        </div>
                    </div>
                    <div className='image-conatiner-1'>
                        <div className='image-wrapper'>
                            <img src={require("../../assets/beach.png")} className='login-img' />
                        </div>
                        <div className='image-wrapper'>
                            <img src={require("../../assets/skyflower.png")} className='login-img' />
                        </div>
                        <div className='image-wrapper'>
                            <img src={require("../../assets/orangegirl.png")} className='login-img' />
                        </div>
                    </div>
                    <div className='image-conatiner-1'>
                        <div className='image-wrapper'>
                            <img src={require("../../assets/flowergirl.png")} className='login-img' />
                        </div>
                        <div className='image-wrapper'>
                            <img src={require("../../assets/vogueflowers.png")} className='login-img' />
                        </div>
                        <div className='image-wrapper'>
                            <img src={require("../../assets/bookfood.png")} className='login-img' />
                        </div>
                    </div>
                </div>
                <div className='login-card-conatiner'>
                    <div className='login-card-head'>
                        <img src={require('../../assets/login-logo.png')} width={46} height={34} />
                        <span>Vibesnap</span>
                    </div>
                    <span className='login-card-subtext'>Moments That Matter, Shared Forever.</span>
                    <div className='login-card-body'>
                        {loading ? (
                            <div class="loader"></div>
                        ) : (
                            <div className='google-login' onClick={() => handleGoogleLogin()}>
                                <img src={require('../../assets/google.png')} width={18} height={18} />
                                <span>Continue with Google</span>
                            </div>
                        )}
                        {error && <p className="error">{error}</p>}
                    </div>
                    <div className="developed-by-prabhu">
                        <span>Developed by Prabhu Govikar</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
