import React, { useEffect } from 'react';
import './layout.css'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../ThemeContext';
export default function Layout() {
  const { isDarkMode } = useTheme(); 
  console.log(`isDarkMode`, isDarkMode);
  // useEffect(() => {
  //   document.body.className = isDarkMode ? 'dark' : 'light';
  // }, [isDarkMode]);
  return (
    <div className={`layout ${isDarkMode ? 'dark' : 'light'}`}> 
      <main>
        <Outlet /> 
      </main>
    </div>
  )
}
