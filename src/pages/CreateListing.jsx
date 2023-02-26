import React, { useState } from 'react';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    type: 'rent',
  });
  const { type } = formData;

  const onChange = () => {};
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
      <form>
        <p className='text-lg mt-6 font-semibold '>Sell / Rent</p>
        <div className='flex '>
          <button
            type='button'
            id='type'
            value='sale'
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === 'rent' ? 'bg-white' : 'bg-slate-500 text-white'
            } `}
          >
            Sell
          </button>
          <button
            type='button'
            id='type'
            value='sale'
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === 'sale' ? 'bg-white' : 'bg-slate-500 text-white'
            } `}
          >
            rent
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
