import React, { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
      <div className='flex justify-center flex-wrap max-w-6xl mx-auto'>
        <div className='flex flex-col md:w-[60%] lg:w-[75%] sm:w-[50%] mt-10'>
          <form className='flex flex-col'>
            <input
              type='email'
              id='email'
              value={email}
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
              onChange={onChange}
              placeholder='Email address'
            />
            <div className='relative mb-6'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={password}
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out'
                onChange={onChange}
                placeholder='Password'
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className='absolute right-3 top-3 text-xl cursor-pointer'
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className='absolute right-3 top-3 text-xl cursor-pointer'
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
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
                  to='/forgot-password'
                  className='text-blue-700 hover:text-blue-800 transition duration-200 ease-in-out'
                >
                  Forgot Password?
                </Link>
              </p>
            </div>

            <button
              className='bg-blue-400 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-500 transition duration-150 ease-in-out active:bg-blue-600'
              type='submit'
            >
              Sign in
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
