import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  function onChange(e) {
    setEmail(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email was sent');
    } catch (error) {
      toast.error('could not send reset password');
    }
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Forgot Password</h1>
      <div className='flex justify-center flex-wrap max-w-6xl mx-auto'>
        <div className='flex flex-col md:w-[60%] lg:w-[75%] sm:w-[50%] mt-10'>
          <form onSubmit={onSubmit} className='flex flex-col'>
            <input
              type='email'
              id='email'
              value={email}
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
              onChange={onChange}
              placeholder='Email address'
            />

            <div className='flex justify-between whitespace-nowrap text-sm '>
              <p className='mb-6'>
                Don't have an account?
                <Link
                  to='/sign-up'
                  className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'
                >
                  Register
                </Link>
              </p>
              <p>
                <Link
                  to='/sign-in'
                  className='text-blue-700 hover:text-blue-800 transition duration-200 ease-in-out'
                >
                  sign in instead
                </Link>
              </p>
            </div>

            <button
              className='bg-blue-400 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-500 transition duration-150 ease-in-out active:bg-blue-600'
              type='submit'
            >
              Send reset password
            </button>
            <div className='flex flex-col items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
