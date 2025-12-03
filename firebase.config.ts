import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSy...", // Replace with your API key if needed
    authDomain: "shonali-desh-19ead.firebaseapp.com",
    databaseURL: "https://shonali-desh-19ead-default-rtdb.firebaseio.com",
    projectId: "shonali-desh-19ead",
    storageBucket: "shonali-desh-19ead.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
