import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import Swal from 'sweetalert2';
import { MdMenu, MdClose, MdDashboard, MdCheckBox, MdCalendarToday, MdSettings, MdLogout } from "react-icons/md";

const Sidebar = () => {
  const { user, logout, theme } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // السطر ده هو اللي هيضمن إن الألوان تتغير لحظياً حتى لو الـ CSS Modules معلق
  useEffect(() => {
    const sidebarElement = document.querySelector(`.${styles.sidebar}`);
    if (sidebarElement) {
      if (theme === 'light') {
        sidebarElement.style.setProperty('background-color', '#ffffff', 'important');
        sidebarElement.style.setProperty('color', '#1a1a2e', 'important');
      } else {
        sidebarElement.style.setProperty('background-color', '#1a1a2e', 'important');
        sidebarElement.style.setProperty('color', '#ffffff', 'important');
      }
    }
  }, [theme, isOpen]); // يشتغل لما المود يتغير أو المنيو تفتح

  const isLight = theme === 'light';

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5c59f2',
      background: isLight ? '#fff' : '#1a1a2e',
      color: isLight ? '#000' : '#fff'
    });
    if (result.isConfirmed) {
      await logout();
      navigate('/login');
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button 
        className={styles.mobileMenuBtn} 
        onClick={toggleMenu}
        style={{ color: isLight ? '#5c59f2' : '#ffffff', zIndex: 9999 }}
      >
        {isOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
      </button>

      {isOpen && <div className={styles.overlay} onClick={closeMenu}></div>}

      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''} ${isLight ? styles.lightMode : ''}`}>
        
        <div className={styles.profileSection} style={{ backgroundColor: isLight ? '#f1f3f9' : '' }}>
          <img 
            src={user?.photoURL || "https://via.placeholder.com/80"} 
            alt="Profile" 
            className={styles.profileImg} 
            referrerPolicy="no-referrer"
          />
          <h3 style={{ color: isLight ? '#1a1a2e' : '#ffffff' }}>{user?.displayName || "User"}</h3>
        </div>

        <nav className={styles.navLinks}>
          <NavLink to="/home" onClick={closeMenu} className={({ isActive }) => isActive ? styles.activeLink : styles.linkItem}>
            <MdDashboard className={styles.icon} style={{ color: isLight ? '#5c59f2' : '' }} /> 
            <span style={{ color: isLight ? '#1a1a2e' : '' }}>Dashboard</span>
          </NavLink>
          
          <NavLink to="/todo" onClick={closeMenu} className={({ isActive }) => isActive ? styles.activeLink : styles.linkItem}>
            <MdCheckBox className={styles.icon} style={{ color: isLight ? '#5c59f2' : '' }} /> 
            <span style={{ color: isLight ? '#1a1a2e' : '' }}>Todo List</span>
          </NavLink>
          
          <NavLink to="/calendar" onClick={closeMenu} className={({ isActive }) => isActive ? styles.activeLink : styles.linkItem}>
            <MdCalendarToday className={styles.icon} style={{ color: isLight ? '#5c59f2' : '' }} /> 
            <span style={{ color: isLight ? '#1a1a2e' : '' }}>Calendar</span>
          </NavLink>
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn} style={{ marginTop: 'auto' }}>
          <MdLogout size={20} /> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;