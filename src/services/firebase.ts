import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrKUo2ixhP9CL3CrtM7p4NUsLEjCVPL84",
  authDomain: "ai-audio-studio.firebaseapp.com",
  projectId: "ai-audio-studio",
  storageBucket: "ai-audio-studio.appspot.com",
  messagingSenderId: "247261957386",
  appId: "1:247261957386:web:e58d316350ab6e7a303ef3",
  measurementId: "G-4RKFFPNTDS",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
