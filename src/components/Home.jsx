import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { MdCheckBox, MdCalendarToday, MdSettings, MdPerson } from "react-icons/md";

const Home = () => {
  const navigate = useNavigate();

  // مصفوفة الخدمات اللي هتظهر في الجريد
  const services = [
    {
      id: 1,
      title: "Todo List",
      description: "Manage your daily tasks and productivity.",
      icon: <MdCheckBox />,
      path: "/todo",
      color: "#5c59f2" // البنفسجي
    },
    {
      id: 2,
      title: "Calendar",
      description: "Check your events and schedule meetings.",
      icon: <MdCalendarToday />,
      path: "/calendar",
      color: "#ff8fb1" // البمبي
    },

  ];

  return (
    <div className={styles.homeWrapper}>
      <header className={styles.welcomeHeader}>
        <h1>Welcome Back, Captain! 🚀</h1>
        <p>Here's what's happening with your projects today.</p>
      </header>

      <div className={styles.gridContainer}>
        {services.map((service) => (
          <div 
            key={service.id} 
            className={styles.card} 
            onClick={() => navigate(service.path)}
          >
            <div className={styles.iconWrapper} style={{ backgroundColor: `${service.color}22`, color: service.color }}>
              {service.icon}
            </div>
            <div className={styles.cardInfo}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
            <div className={styles.cardArrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;