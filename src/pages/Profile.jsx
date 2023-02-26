import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in firbase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //update name in the firestore
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success('Profile detail updated');
    } catch (error) {
      toast.error('could not update the profile detail');
    }
  };

  return (
    <>
      <section className='max-w-6xl max-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            <input
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && 'bg-green-200 focus: bg-green-200'
              }`}
              type='text'
              id='name'
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
            />
            <input
              disabled
              className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out'
              type='email'
              id='email'
              value={email}
            />

            <div className='flex justify-between whitespace-nowrap text-sm mb-6'>
              <p className='flex items-center'>
                Do you want to change your name?{' '}
                <span
                  onClick={() => {
                    setChangeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'
                >
                  {changeDetail ? 'Apply Change' : 'Edit'}
                </span>
              </p>
              <p
                onClick={onLogout}
                className='text-blue-600 hover:text-blue-700 transition ease-in-out duration-200 cursor-pointer'
              >
                Sign Out?
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
