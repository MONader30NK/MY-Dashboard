import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import Swal from 'sweetalert2'; // استيراد المكتبة

const Login = () => {
  const { login, signUp, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // دالة مساعدة لعرض الأخطاء بشكل احترافي
  const showError = (msg) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: msg,
      background: '#252545', // نفس لون الكارد بتاعك
      color: '#fff',
      confirmButtonColor: '#5c59f2',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // رسالة نجاح خفيفة
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#252545',
        color: '#fff'
      });
      Toast.fire({ icon: 'success', title: 'Signed in successfully' });
      
      navigate("/home");
    } catch (error) {
      if (error.code !== 'auth/cancelled-popup-request') {
        showError("Google sign-in failed. Please try again.");
      }
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isSignUp) {
      await signUp(email, password);
    } else {
      await login(email, password);
    }
    navigate("/home");
  } catch (err) {
    let friendlyMsg = "";

    // هنا بنفصّل الرسالة على حسب كود الخطأ
switch (err.code) {
      case 'auth/invalid-credential':
        friendlyMsg = "Invalid email or password. If you don't have an account, please sign up first.";
        break;
      case 'auth/user-not-found':
        friendlyMsg = "Account not found. Please check the email or create a new account.";
        break;
      case 'auth/wrong-password':
        friendlyMsg = "Incorrect password. Please try again or reset your password.";
        break;
      case 'auth/email-already-in-use':
        friendlyMsg = "This email is already registered. Try logging in instead.";
        break;
      case 'auth/too-many-requests':
        friendlyMsg = "Too many failed attempts. Access has been temporarily disabled. Please try again later.";
        break;
      case 'auth/weak-password':
        friendlyMsg = "The password is too weak. Please use at least 6 characters.";
        break;
      default:
        friendlyMsg = "An unexpected error occurred. Please check your connection and try again.";
    
    }

    Swal.fire({
      icon: 'error',
      title: 'بيانات غير صحيحة',
      text: friendlyMsg,
      background: '#252545',
      color: '#fff',
      confirmButtonColor: '#5c59f2',
      confirmButtonText: 'تمام، هجرب تاني'
    });
  }
};

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className={styles.inputField}
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className={styles.inputField}
          />
          
          <button type="submit" className={styles.authBtn}>
            {isSignUp ? "Sign Up" : "Login"}
          </button>

          <div className={styles.divider}>OR</div>

          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className={styles.googleBtn}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
            />
            Sign in with Google
          </button>
        </form>

        <p onClick={() => setIsSignUp(!isSignUp)} className={styles.toggleText}>
          {isSignUp ? "Already have an account? Login" : "New here? Create an account"}
        </p>
      </div>
    </div>
  );
};

export default Login;