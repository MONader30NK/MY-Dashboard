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
  apiKey: "AIzaSyCfrMtjjnP0Z2bL_cTdj8B_FGqd447Z3X8",
  authDomain: "dash-board-d5421.firebaseapp.com",
  projectId: "dash-board-d5421",
  storageBucket: "dash-board-d5421.firebasestorage.app",
  messagingSenderId: "1080876740185",
  appId: "1:1080876740185:web:734979161741d032424b48",
  measurementId: "G-C1DM0HJNQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// تصدير الأدوات اللي هنستخدمها في المشروع
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;