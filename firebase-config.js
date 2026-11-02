// ===== Firebase সেটিংস =====
// Firebase Console → Project settings → Your apps → Web app থেকে এই মানগুলো কপি করে বসান।
// apiKey খালি থাকলে অ্যাপ "ডেমো মোডে" চলবে (তথ্য শুধু ওই ফোনেই থাকবে)।
window.PM_FIREBASE = {
  apiKey: "AIzaSyBVR9licwqV5Eqnykyp0aBu7oQDqHhyPGI",
  authDomain: "programme-manager-8dfb1.firebaseapp.com",
  projectId: "programme-manager-8dfb1",
  storageBucket: "programme-manager-8dfb1.firebasestorage.app",
  messagingSenderId: "406162722661",
  appId: "1:406162722661:web:1ff0b17023861a78b79b8c"
};

// প্রধান অ্যাডমিনের ইমেইল। এই ইমেইল দিয়ে প্রথমবার লগইন করলে সে নিজে থেকেই অ্যাডমিন হয়ে যাবে।
// firestore.rules ফাইলেও একই ইমেইল বসাতে হবে।
window.PM_ADMIN_EMAIL = "shishir.mmc163@gmail.com";
