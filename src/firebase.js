// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWsgzja3u5XizpYnnj2zZ5KoQLl_FErN8",
  authDomain: "realestate-listing-react.firebaseapp.com",
  projectId: "realestate-listing-react",
  storageBucket: "realestate-listing-react.appspot.com",
  messagingSenderId: "473038109466",
  appId: "1:473038109466:web:cdf5f6f1fff481fa490aa3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
