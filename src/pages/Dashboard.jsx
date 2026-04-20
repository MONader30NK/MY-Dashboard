import { useNavigate, NavLink, Outlet } from "react-router-dom";
import styles from './Dashboard.module.css';
import { useAuth } from "../context/AuthContext"; 
import Swal from 'sweetalert2';
import { useState } from "react"; 

import { 
  MdDashboard, MdCheckBox, MdLogout, MdChevronLeft, 
  MdCalendarToday, MdPerson, MdSettings, MdMenu, MdClose 
} from "react-icons/md";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, theme } = useAuth(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isLight = theme === 'light';

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Sign Out?',
      text: "Are you sure you want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5c59f2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      background: isLight ? '#fff' : '#1a1a2e', 
      color: isLight ? '#000' : '#fff'
    });

    if (result.isConfirmed) {
      try { await logout(); navigate("/login"); } catch (error) { console.error(error); }
    }
  };

  return (
    /* ضفنا data-theme هنا عشان نكسر عجز الـ CSS Modules */
    <div 
      className={`${styles.container} ${isLight ? 'light-theme-active' : ''}`}
      data-theme={theme} 
    >
      
      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}

      <aside className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarActive : ''}`}>
        <button className={styles.closeMenuBtn} onClick={closeMenu}><MdClose /></button>

        <div className={styles.profileSection}>
          <div className={styles.avatarWrapper}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className={styles.avatar} referrerPolicy="no-referrer" />
            ) : (
              <div className={styles.initialsAvatar}>
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.displayName || "User"}</p>
            <p className={styles.userStatus}>Online</p>
          </div>
        </div>

        <nav className={styles.navMenu}>
          <p className={styles.sectionTitle}>Main Menu</p>
          <NavLink to="/home" onClick={closeMenu} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            <MdDashboard className={styles.icon} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/todo" onClick={closeMenu} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            <MdCheckBox className={styles.icon} /> <span>Todo List</span>
          </NavLink>
          <NavLink to="/calendar" onClick={closeMenu} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            <MdCalendarToday className={styles.icon} /> <span>Calendar</span>
          </NavLink>

          <p className={styles.sectionTitle}>Profile</p>
          <NavLink to="/profile" onClick={closeMenu} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            <MdPerson className={styles.icon} /> <span>My Profile</span>
          </NavLink>
          <NavLink to="/settings" onClick={closeMenu} className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
            <MdSettings className={styles.icon} /> <span>Settings</span>
          </NavLink>

          <p className={styles.sectionTitle}>Others</p>
          <button className={styles.logoutBtn} onClick={() => { handleLogout(); closeMenu(); }}>
            <MdLogout className={styles.icon} /> <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <button className={styles.openMenuBtn} onClick={toggleMenu}><MdMenu /></button>
          
          {/* كلمة DASHBOARD اللي محيرة المتصفح */}
          <div className={styles.brandTitle}>DASHBOARD</div>
          
          <div className={styles.headerInfo}>
            <h1>Hello, {user?.displayName?.split(' ')[0] || "User"}! 👋</h1>
          </div>
        </header>
        <div className={styles.pageDisplay}><Outlet /></div>
      </main>
    </div>
  );
};

export default Dashboard;