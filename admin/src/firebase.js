import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyANMUF-wHokJPRdlRfx4rliKarpySuKirs",
  authDomain: "lucknowzone-32e8f.firebaseapp.com",
  projectId: "lucknowzone-32e8f",
  storageBucket: "lucknowzone-32e8f.firebasestorage.app",
  messagingSenderId: "331463763592",
  appId: "1:331463763592:web:8799f6463123bbcfb4a13d",
  measurementId: "G-KRVLHTCK5S"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
