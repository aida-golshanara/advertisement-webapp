import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';

const EditListing = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    description: '',
    offer: false,
    regularPrice: 50,
    discountedPrice: 25,
    images: {},
  });
  const {
    type,
    name,
    description,
    offer,
    regularPrice,
    discountedPrice,
    images,
  } = formData;

  const params = useParams();

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error('you cannot edit this listing');
      navigate('/');
    }
  }, [navigate, listing, auth.currentUser.uid]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate('/');
        toast.error('Listing does not exist!');
      }
    }
    fetchListing();
  }, [navigate, params.listingId]);

  const onChange = (e) => {
    let boolean = null;
    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }
    //files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    //text/boolean/numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error('Discounted price needs to be less than regular price');
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error('maximum 6 images are allowed');
      return;
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running' + progress);
                break;
              default:
                console.log('Upload state is unknown or not handled');
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error('Images error, please follow the uploading rules.');
      return;
    });
    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = doc(db, 'listings', params.listingId);
    await updateDoc(docRef, formDataCopy);

    toast.success('Listing Edited');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold'>Edit Listing</h1>
      <form onSubmit={onSubmit}>
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
            value='rent'
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === 'sale' ? 'bg-white' : 'bg-slate-500 text-white'
            } `}
          >
            rent
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Name</p>
        <input
          type='text'
          id='name'
          value={name}
          onChange={onChange}
          placeholder='Name'
          maxLength={32}
          minLength={5}
          required
          className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
        />
        <p className='font-bold'>Describe your property!</p>
        <textarea
          className='w-full rounded my-2 text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
          type='text'
          id='description'
          value={description}
          onChange={onChange}
          required
        />
        <p className='mt-4 font-bold'>Do You Want to Make it an Offer?</p>
        <div className='flex gap-3 my-2'>
          <button
            type='button'
            id='offer'
            value={true}
            onClick={onChange}
            className={`py-2 rounded w-full ${
              !offer ? 'bg-white text-black' : 'bg-slate-500 text-white'
            } `}
          >
            Yes
          </button>
          <button
            type='button'
            id='offer'
            value={false}
            onClick={onChange}
            className={`py-2 rounded w-full ${
              offer ? 'bg-white text-black' : 'bg-slate-500 text-white'
            } `}
          >
            No
          </button>
        </div>
        <br />
        <div>
          <div>
            {offer ? (
              <p className='font-bold mb-3'>
                Write your regular price and discount offer!
              </p>
            ) : (
              <p className='font-bold mb-3'>What is your property price?</p>
            )}

            <div className='flex gap-6 my-2'>
              <div className='flex w-full'>
                <p className='text-[.6rem] mr-1'>
                  Regular <br /> Price
                </p>
                <input
                  className='w-full rounded'
                  type='number'
                  id='regularPrice'
                  value={regularPrice}
                  onChange={onChange}
                  min='50'
                  max='10000000000'
                  required
                />
                {type === 'rent' && (
                  <div className='ml-2 '>
                    <p>
                      $ <span className='text-[.5rem]'>Per/</span>{' '}
                    </p>
                    <p className='text-[.6rem]'>Mounth</p>
                  </div>
                )}
              </div>
              {offer && (
                <div className='flex w-full'>
                  <p className='text-[.6rem] mr-1'>
                    Discounted <br /> Price
                  </p>
                  <input
                    className='w-full rounded'
                    type='number'
                    id='discountedPrice'
                    value={discountedPrice}
                    onChange={onChange}
                    min='25'
                    max='10000000000'
                    required={offer}
                  />
                  {type === 'rent' && (
                    <div className='ml-2 '>
                      <p>
                        $ <span className='text-[.5rem]'>Per/</span>{' '}
                      </p>
                      <p className='text-[.6rem]'>Mounth</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className='my-3'>
          <p className='font-bold'>Upload pictures of your property!</p>
          <p className='mb-2 text-[.8rem] text-red-600'>
            You can select <span className='font-bold'>6</span> images; each
            should be less than <span className='font-bold'>500Kb</span>.
          </p>
          <input
            className='w-full bg-white p-2 rounded cursor-pointer'
            type='file'
            id='images'
            onChange={onChange}
            accept='jpg , png , jpeg'
            multiple
            required
          />
        </div>
        <button
          className='w-full p-2 bg-blue-500 text-white rounded text-bold my-6 uppercase shadow-md font-medium hover:bg-blue-600 transition duration-150 ease-in-out'
          type='submit'
        >
          Edit Your Listing
        </button>
      </form>
    </main>
  );
};

export default EditListing;
