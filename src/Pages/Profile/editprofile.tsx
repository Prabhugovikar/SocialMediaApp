import React from 'react'
import './editprofile.css'
import { useTheme } from '../../ThemeContext'
export default function Editprofile() {
    const { isDarkMode } = useTheme();
    return (
        <div className='editprofile'>
            <div className='editprofile-container'>
            <div className='profile-header-container'>
                <div className='profile-header'>
                    <img src={require("../../assets/profileBackground.png")} className='profile-banner-img' />

                    <div className='profile-edit-banner-pencil'>
                    <img src={require("../../assets/HiPencil.png")} width='16' height='16' />
                    </div>

                </div>
                <div className='profile-edit-wrapper'>
                    <div className='profile-header-userprofile'>
                        <img src={require("../../assets/girl.png")} className='user-profile' />
                    </div>
                    <div className='editprofile-icon-conatiner'>
                        <img src={require("../../assets/HiPencil.png")} width='16' height='16' />
                    </div>
                </div>
            </div>

            <div className='editprofile-form-wrapper'>
              <div className='editprofile-input-wrapper'>
                <label>Name</label>
                <input className={`editprofile-input ${isDarkMode ? 'editprofile-dark' : ''}`} type='text'/>
              </div>
              <div className='editprofile-input-wrapper'>
                <label>Bio</label>
                <input className={`editprofile-input ${isDarkMode ? 'editprofile-dark' : ''}`} type='text'/>
              </div>
            </div>
            </div>
            <div className='editprofile-save-container'>
                <button className={isDarkMode ? 'save-button-dark' : 'save-button-light'}>SAVE</button>
            </div>
        </div>
    )
}
