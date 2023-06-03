// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0121cEond4FXcKbIZjrmR7eqHESgGB2I",
  authDomain: "chainlink-hackathon-23.firebaseapp.com",
  projectId: "chainlink-hackathon-23",
  storageBucket: "chainlink-hackathon-23.appspot.com",
  messagingSenderId: "677294127195",
  appId: "1:677294127195:web:dffe83c1ab6772f340a77e",
  measurementId: "G-6QWQD3RN7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;