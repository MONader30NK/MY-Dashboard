import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CounterProject from './Reducer.jsx';
import TodoList from './components/Todo-list.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Notfound from './Notfound.jsx';
import Home from './components/Home.jsx';
import CalendarView from './components/CalendarView.jsx';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login.jsx';
import Profile from './components/Profile.jsx';
import Settings from './components/Settings.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="todo" element={<TodoList />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
