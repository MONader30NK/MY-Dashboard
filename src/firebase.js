import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ضفنا مكتبة التسجيل
import { getFirestore } from "firebase/firestore"; // ضفنا مكتبة قاعدة البيانات
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file || !user) return;

  const storage = getStorage();
  const storageRef = ref(storage, `profilePictures/${user.uid}`);

  try {
    // 1. رفع الصورة
    await uploadBytes(storageRef, file);
    
    // 2. الحصول على اللينك
    const downloadURL = await getDownloadURL(storageRef);
    
    // 3. تحديث الداتابيز باللينك الجديد
    const userRef = doc(db, "usersData", user.uid);
    await setDoc(userRef, { photoURL: downloadURL }, { merge: true });
    
    // 4. تحديث الـ state في الصفحة عشان الصورة تظهر فوراً
    setUserData(prev => ({ ...prev, photoURL: downloadURL }));
    
    alert("Image uploaded successfully!");
  } catch (error) {
    console.error("Upload error:", error);
  }
};
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// تصدير الأدوات اللي هنستخدمها في المشروع
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;