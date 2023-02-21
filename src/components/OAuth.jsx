import React from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function OAuth() {
  return (
    <button className='flex items-center justify-center w-full bg-red-500 text-white px-7 py-3 uppercase text-sm font-medium rounded shadow-md hover:bg-red-600 transition duration-150 ease-in-out active:bg-red-700'>
      <FcGoogle className='text-2xl bg-white rounded-full mr-2' />
      Continue with google
    </button>
  );
}
