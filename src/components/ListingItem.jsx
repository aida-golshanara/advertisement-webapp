import React from 'react';
import Moment from 'react-moment';
import { FaTrash } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';

export default function ListingItem({ listing, id }) {
  return (
    <li className='bg-white relative flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 ease-in-out m-[10px]'>
      <Link className='contents' to={`/category/${listing.type}/${id}`}>
        <img
          className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in'
          loading='lazy'
          src={listing.imgUrls[0]}
          alt=''
        />
        <Moment
          className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg'
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className='w-full p-[10px]'>
          <p className='font-semibold m-0 text-xl truncate'>{listing.name}</p>
          <p className='text-[#457b9d] mt-2 font-semibold '>
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            {listing.type === 'rent' && (
              <span className='ml-1 text-xs'>per Month</span>
            )}
          </p>
        </div>
      </Link>
    </li>
  );
}
