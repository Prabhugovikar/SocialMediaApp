import React, { useState } from 'react'
import './editprofile.css'
import { useTheme } from '../../ThemeContext';
import { AppDispatch, } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../redux/Slice/editSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Editprofile() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const prevdata = location?.state
    console.log("prevdata", prevdata);
    const prevBio = prevdata?.Bio ;
    const prevname = prevdata?.username;
    const UserName = localStorage.getItem('username');
    const finalname = prevname || UserName;
    const ProfileImage = localStorage.getItem('profileImage');
    const { isDarkMode } = useTheme();
    const [name, setName] = useState(finalname);
    const [bio, setBio] = useState(prevBio);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setProfileImage(e.target.files[0]);
        }
      };
    
      const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setBannerImage(e.target.files[0]);
        }
      };

    const handleSubmit = async () => {
        const userId = localStorage.getItem('userId');
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('username', name);
        formData.append('Bio', bio);
        // if (profileImage) formData.append('profileImage', profileImage);
        // if (bannerImage) formData.append('bannerImage', bannerImage);

        try {
            await dispatch(updateProfile(formData)).unwrap();
            navigate('/profile');  
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className='editprofile'>
            <div className='editprofile-container'>
                <div className='profile-header-container'>
                    <div className='profile-header'>
                        <input
                            type="file"
                            onChange={handleBannerImageChange}
                            style={{ display: 'none' }} 
                            id="bannerImageInput"
                        />
                        <img src={require("../../assets/profileBackground.png")} className='profile-banner-img' />
{/*                     
                        <div className='profile-edit-banner-pencil' onClick={() => document.getElementById('bannerImageInput')?.click()}>
                            <img src={require("../../assets/HiPencil.png")} width='16' height='16' />
                        </div> */}
                        <div className='backarroe-editprofile'>
                            <img src={require("../../assets/white_backarrow.png")} width='16' height='16' onClick={() => navigate('/profile')} />
                            <span>Edit Profile</span>
                        </div>
                    </div>
                    <div className='profile-edit-wrapper'>
                        <div className='profile-header-userprofile'>
                            <input
                                type="file"
                                onChange={handleProfileImageChange}
                                style={{ display: 'none' }} 
                                id="profileImageInput"
                            />
                            <img src={ProfileImage} className='user-profile' />
                        </div>
                        {/* <div className='editprofile-icon-conatiner' onClick={() => document.getElementById('profileImageInput')?.click()}>
                            <img src={require("../../assets/HiPencil.png")} width='16' height='16' />
                        </div> */}
                    </div>
                </div>

                <div className='editprofile-form-wrapper'>
                    <div className='editprofile-input-wrapper'>
                        <label>Name</label>
                        <input className={`editprofile-input ${isDarkMode ? 'editprofile-dark' : ''}`}
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='editprofile-input-wrapper'>
                        <label>Bio</label>
                        <input className={`editprofile-input ${isDarkMode ? 'editprofile-dark' : ''}`}
                            type='text'
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className='editprofile-save-container'>
                <button className={isDarkMode ? 'save-button-dark' : 'save-button-light'}
                    onClick={handleSubmit}
                >
                    SAVE
                </button>
            </div>
        </div>
    )
}
