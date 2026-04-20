import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, auth, storage } from '../firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from "firebase/auth";
import styles from './Profile.module.css';
import Swal from 'sweetalert2';
import { MdCloudUpload } from "react-icons/md"; // أيقونة الرفع

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    phoneNumber: "",
    photoURL: user?.photoURL || ""
  });

  // دالة لجلب البيانات من Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "usersData", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData(prev => ({
            ...prev,
            phoneNumber: data.phoneNumber || "",
            // نعطي الأولوية للصورة المخصصة المرفوعة
            photoURL: data.customPhoto || user?.photoURL || ""
          }));
        }
      }
    };
    fetchUserData();
  }, [user]);

  // دالة للحصول على أول حرف من الاسم
  const getInitial = () => {
    if (formData.displayName) return formData.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "?";
  };

  // --- (1) دالة رفع الصورة (تمت زيادة الحجم لـ 5 ميجا) ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // التأكد من حجم الملف (تمت زيادته لـ 5 ميجا = 5 * 1024 * 1024 بايت)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Please upload an image smaller than 5MB.',
        background: 'var(--card-bg)',
        color: 'var(--text-main)'
      });
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // تحديث الـ State فوراً عشان الصورة تظهر في الصفحة
      setFormData(prev => ({ ...prev, photoURL: downloadURL }));
      
      // --- (2) تحديث الـ Auth فوراً عشان السايد بار يتحدث ---
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          photoURL: downloadURL
        });
      }

      Swal.fire({
        icon: 'success',
        title: 'Image Uploaded Successfully!',
        text: 'Don\'t forget to click "Save Profile" to update everything.',
        background: 'var(--card-bg)',
        color: 'var(--text-main)',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire('Error', 'Failed to upload image. Please try again.', 'error');
    }
    setUploading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. تحديث الاسم في Auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
          photoURL: formData.photoURL
        });
      }

      // 2. تحديث/إنشاء البيانات في Firestore
      const userRef = doc(db, "usersData", user.uid);
      await setDoc(userRef, {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        customPhoto: formData.photoURL,
        lastUpdate: new Date()
      }, { merge: true });

      await Swal.fire({
        icon: 'success',
        title: 'Profile Saved!',
        text: 'Your changes have been fully updated.',
        background: 'var(--card-bg)',
        color: 'var(--text-main)',
        timer: 2000,
        showConfirmButton: false
      });

      // ريفريش ذكي عشان الداتا تتسمع في كل مكان
      window.location.reload();

    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({ 
        icon: 'error', 
        title: 'Save failed',
        text: error.message 
      });
    }
    setLoading(false);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        
        {/* --- (3) قسم الصورة مع الـ Initial والزرار الأنيق --- */}
        <div className={styles.imageSection}>
          <div className={styles.avatarWrapper}>
            {formData.photoURL ? (
              <img 
                src={formData.photoURL} 
                alt="Profile" 
                className={styles.largeAvatar}
              />
            ) : (
              <div className={styles.initialAvatar}>
                {getInitial()}
              </div>
            )}
            
            {uploading && (
              <div className={styles.uploadLoader}>
                <div className={styles.spinner}></div>
              </div>
            )}
          </div>
          
          {/* زرار الرفع الأنيق الجديد */}
          {/* <label className={styles.customUploadBtn}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              hidden 
              disabled={uploading}
            />
            <MdCloudUpload className={styles.uploadIcon} />
            <span>{uploading ? "Uploading..." : "Upload New Image"}</span>
          </label>
          <p className={styles.sizeHint}>Max size: 5MB</p> */}
        </div>

        <form onSubmit={handleUpdate} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              value={formData.displayName} 
              onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
              required
              placeholder="Your Full Name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email (Locked 🔒)</label>
            <input type="email" value={user?.email} disabled className={styles.disabledInput} />
          </div>

          <div className={styles.inputGroup}>
            <label>Phone Number</label>
            <input 
              type="text" 
              placeholder="+20 100 000 0000" 
              value={formData.phoneNumber} 
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
            />
          </div>

          <button type="submit" className={styles.saveBtn} disabled={loading || uploading}>
            {loading ? "Saving Changes..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;