import React from 'react'
import "./navbar.css"
import { useTheme } from '../../ThemeContext';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const profileImage = localStorage.getItem('profileImage');
  const userName = localStorage.getItem('username');
  const changePath = () => {
    navigate('/profile');
  };
  return (
    <div className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-left'>
          <div className='navbar-profile'>
            <img src={profileImage} onClick={()=>changePath()} className='profile-img' />
          </div>
          <div className='navbar-profile-name'>
            <span>Welcome Back,</span>
            <span>{userName}</span>
          </div>
        </div>
        <div className='navbar-right'>
          <label class="switch">
            <input type="checkbox" 
            checked={isDarkMode} // Reflect the current theme state
            onChange={toggleDarkMode}
            />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  )
}
