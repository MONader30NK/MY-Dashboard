import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import { MdDarkMode, MdLightMode } from "react-icons/md";

const Settings = () => {
  // بنقرأ الحالة المحفوظة في المتصفح، لو مفيش بنفترض إنه Dark
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') !== 'light'
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Settings</h2>
      
      <div className={styles.section}>
        <div className={styles.info}>
          <h3>Appearance</h3>
          <p>Switch between dark and light mode</p>
        </div>
        
        <button 
          className={styles.themeToggle} 
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? (
            <><MdLightMode /> Switch to Light Mode</>
          ) : (
            <><MdDarkMode /> Switch to Dark Mode</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;