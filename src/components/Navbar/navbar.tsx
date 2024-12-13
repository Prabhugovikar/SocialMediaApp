import React,{useEffect} from 'react'
import "./navbar.css"
import { useTheme } from '../../ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchProfileData } from '../../redux/Slice/profileSlice';
export default function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { profileData, userProfile, loading, error } = useSelector((state: RootState) => state.profile);
  console.log("name header", userProfile?.username)
  const navigate = useNavigate();
  const profileImage = localStorage.getItem('profileImage');
  const userName = localStorage.getItem('username');
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Or get it from wherever you're storing the user ID
    if (userId) {
      dispatch(fetchProfileData(userId));
    }
  }, [dispatch]);
  const changePath = () => {
    navigate('/profile');
  };
  return (
    <div className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-left'>
          <div className='navbar-profile'>
            <img src={profileImage} onClick={() => changePath()} className='profile-img' />
          </div>
          <div className='navbar-profile-name'>
            <span>Welcome Back,</span>
            <span>{userProfile?.username || userName}</span>
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
