import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';

export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //check for the user
      const docRef = doc(db, 'user', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error('could not authorize with google!');
    }
  }
  return (
    <button
      type='button'
      onClick={onGoogleClick}
      className='flex items-center justify-center w-full bg-red-500 text-white px-7 py-3 uppercase text-sm font-medium rounded shadow-md hover:bg-red-600 transition duration-150 ease-in-out active:bg-red-700'
    >
      <FcGoogle className='text-2xl bg-white rounded-full mr-2' />
      Continue with google
    </button>
  );
}
