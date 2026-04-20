import { useState, useReducer, useEffect } from "react";
import styles from './todo-list.module.css';
import { db } from "../firebase";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const initialState = { tasks: [] };

function reducer(state, action) {
    switch (action.type) {
        case 'SET_TASKS':
            return { ...state, tasks: action.payload || [] };
        case 'addTask':
            return { ...state, tasks: [...state.tasks, action.payload] };
        case 'removeTask':
            return { ...state, tasks: state.tasks.filter((_, index) => index !== action.payload) };
        default:
            return state;
    }
}

function TodoList() {
    const { user } = useAuth();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [inputValue, setInputValue] = useState("");

    // (أ) جلب البيانات مرة واحدة أو متابعتها
    useEffect(() => {
        if (!user) return;
        const userDoc = doc(db, "usersData", user.uid);
        
        const unsubscribe = onSnapshot(userDoc, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // فقط نحدث الـ state لو البيانات مختلفة فعلاً عشان منعملش Loop
                if (JSON.stringify(data.myTasks) !== JSON.stringify(state.tasks)) {
                    dispatch({ type: 'SET_TASKS', payload: data.myTasks || [] });
                }
            }
        });
        return () => unsubscribe();
    }, [user]);

    // (ب) دالة الحفظ المركزية
    const updateFirebase = async (newTasks) => {
        if (user) {
            const userDoc = doc(db, "usersData", user.uid);
            try {
                await setDoc(userDoc, { myTasks: newTasks }, { merge: true });
            } catch (e) {
                console.error("Error updating tasks:", e);
            }
        }
    };

    const handleAdd = () => {
        if (inputValue.trim() !== "") {
            const newTasks = [...state.tasks, inputValue];
            dispatch({ type: 'addTask', payload: inputValue });
            updateFirebase(newTasks); // حفظ فوري
            setInputValue("");
        }
    };

    const handleDelete = (index) => {
        const newTasks = state.tasks.filter((_, i) => i !== index);
        dispatch({ type: 'removeTask', payload: index });
        updateFirebase(newTasks); // حفظ فوري
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Todo List</h1>
            
            <div className={styles.inputSection}>
                <input 
                    className={styles.inputButton} 
                    type="text" 
                    placeholder="Enter a task" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-main)' }}
                />
                <button className={styles.addButton} onClick={handleAdd}>Add Task</button>
            </div>

            <div className={styles.listSection}>
                {state.tasks.map((task, index) => (
                    <div key={index} className={styles.taskItem} style={{ backgroundColor: 'var(--input-bg)' }}>
                        <div className={styles.taskContent}>
                            <input type="checkbox" className={styles.checkbox} id={`task-${index}`} />
                            <label htmlFor={`task-${index}`} style={{ color: 'var(--text-main)' }}>{task}</label>
                            <button className={styles.deleteBtn} onClick={() => handleDelete(index)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TodoList;