import React, { useReducer, useState, useEffect } from 'react';
import styles from './CalendarView.module.css';
import { MdChevronLeft, MdChevronRight, MdClose, MdAdd } from "react-icons/md";
import { db, auth } from '../firebase'; 
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const initialState = {
  daysData: {} 
};

function calendarReducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return { ...state, daysData: action.payload || {} };
    case 'ADD_TASK':
      const { dateKey, task } = action.payload;
      const existingTasks = state.daysData[dateKey] || [];
      return {
        ...state,
        daysData: { ...state.daysData, [dateKey]: [...existingTasks, task] }
      };
    case 'DELETE_TASK':
      const { dKey, index } = action.payload;
      return {
        ...state,
        daysData: {
          ...state.daysData,
          [dKey]: state.daysData[dKey].filter((_, i) => i !== index)
        }
      };
    default:
      return state;
  }
}

const CalendarView = () => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [taskInput, setTaskInput] = useState("");

  // 1. جلب البيانات لحظياً من Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeSnap = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            dispatch({ type: 'SET_INITIAL_DATA', payload: data.calendarTasks || {} });
          }
        });
        return () => unsubscribeSnap();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. دالة الحفظ
  const saveToFirebase = async (updatedDaysData) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { calendarTasks: updatedDaysData }, { merge: true });
      } catch (error) {
        console.error("Firebase Update Error:", error);
      }
    }
  };

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const getDateKey = (day) => `${currentYear}-${currentMonth + 1}-${day}`;

  const handleAddTask = () => {
    if (taskInput.trim() && selectedDay) {
      const dateKey = getDateKey(selectedDay);
      const updatedTasks = [...(state.daysData[dateKey] || []), taskInput];
      const nextDaysData = { ...state.daysData, [dateKey]: updatedTasks };
      
      dispatch({ type: 'ADD_TASK', payload: { dateKey, task: taskInput } });
      saveToFirebase(nextDaysData);
      setTaskInput("");
    }
  };

  const handleDeleteTask = (index) => {
    const dKey = getDateKey(selectedDay);
    const updatedTasks = state.daysData[dKey].filter((_, i) => i !== index);
    const nextDaysData = { ...state.daysData, [dKey]: updatedTasks };

    dispatch({ type: 'DELETE_TASK', payload: { dKey, index } });
    saveToFirebase(nextDaysData);
  };

  return (
    <div className={styles.calendarWrapper}>
      {/* --- الهيدر (رجعناه تاني) --- */}
      <div className={styles.header}>
        <h2 className={styles.monthYear}>
          {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(viewDate)} 
          <span className={styles.year}>{currentYear}</span>
        </h2>
        <div className={styles.navBtns}>
          <button className={styles.navBtn} onClick={() => setViewDate(new Date(currentYear, currentMonth - 1, 1))}><MdChevronLeft /></button>
          <button className={styles.navBtn} onClick={() => setViewDate(new Date(currentYear, currentMonth + 1, 1))}><MdChevronRight /></button>
        </div>
      </div>

      {/* --- شبكة الأيام (رجعت تاني) --- */}
      <div className={styles.daysGrid}>
        {Array(adjustedFirstDay).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className={styles.emptyBox} />
        ))}
        {days.map(day => {
          const dateKey = getDateKey(day);
          const hasTasks = state.daysData[dateKey]?.length > 0;
          return (
            <div 
              key={day} 
              className={`${styles.dayBox} ${selectedDay === day ? styles.activeDay : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <span className={styles.dayNumber}>{day}</span>
              {hasTasks && <div className={styles.taskDot} />}
            </div>
          );
        })}
      </div>

      {/* --- الـ Modal (التاب الجانبية) --- */}
      {selectedDay && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDay(null)}>
          <div className={styles.sideTab} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Tasks for {selectedDay} {new Intl.DateTimeFormat('en-US', { month: 'short' }).format(viewDate)}</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedDay(null)}><MdClose /></button>
            </div>

            <div className={styles.inputArea}>
              <input 
                value={taskInput} 
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="What needs to be done?"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <button onClick={handleAddTask}><MdAdd /></button>
            </div>

            <div className={styles.taskList}>
              {(state.daysData[getDateKey(selectedDay)] || []).map((task, index) => (
                <div key={index} className={styles.taskItem}>
                  <span>{task}</span>
                  <button className={styles.deleteBtn} onClick={() => handleDeleteTask(index)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;