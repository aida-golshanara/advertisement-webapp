// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDQN8ywwMhJq5AAf7g2DV8Xo4_PUrQA2ak',
  authDomain: 'ads-market-app.firebaseapp.com',
  projectId: 'ads-market-app',
  storageBucket: 'ads-market-app.appspot.com',
  messagingSenderId: '94965807148',
  appId: '1:94965807148:web:15760b2d10deb45dfaf989',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
