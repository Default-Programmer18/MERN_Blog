// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernblog-d8eb5.firebaseapp.com",
  projectId: "mernblog-d8eb5",
  storageBucket: "mernblog-d8eb5.appspot.com",
  messagingSenderId: "743407284075",
  appId: "1:743407284075:web:8b2b7e6fa6c3acea01662e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

