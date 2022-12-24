import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import {FcHome} from 'react-icons/fc'
import ListingItem from '../components/ListingItem';

const Profile = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const [changeDetail, setChangeDetail] = useState(false);
  const [userListings, setUserListings] = useState(null);
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const logoutUser = () => {
    auth.signOut();
    navigate('/')
    
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update the display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        // update name in the firestore

        const docRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        })
      }
      toast.success('Profile details updated')

    } catch (error) {
      toast.error('Could not update the profile details')
    }
  }

  
  useEffect(() => {
    const fetchUserListings = async () => {

      const listingRef = collection(db, 'listings');
      const q = query(
        listingRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
          
        });
      });
      
      setUserListings(listings);
      setLoading(false)
    }

    fetchUserListings()
     
  }, [auth.currentUser.uid]);
 

  const onDelete = async (listingID) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingID))
      const updatedListings = userListings.filter(
        listing => listing.id !== listingID
      );
      setUserListings(updatedListings)
      toast.success('Successfully deleted the listing')
    }
  }

  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`)
  }




  return (
    <>
      <section className='max-w-6xl flex flex-col justify-center items-center
      mx-auto'>

      <h1 className='text-3xl text-center mt-6 font-bold'>
        My Profile</h1>

        <div className='w-full md:w-[50%] mt-6 px-4'>
          <form >

            {/* Name input */}
            <input
              type="text"
              id='name'
              value={name}
              disabled={!changeDetail}
              onChange={onChange}

              className={`w-full mb-6  px-4 py-2 text-xl text-gray-700
               bg-white border border-gray-300 rounded transition ease-in-out
               ${changeDetail && 'bg-red-200 focus:bg-red-200'}`}
            />

            
            {/* Email input */}
            <input
              type="email"
              id='email'
              value={email}
              disabled
              onChange={onChange}
              className={`w-full mb-6 px-4 py-2 text-xl text-gray-700
               bg-white border border-gray-300 rounded transition ease-in-out
              `}
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className='flex items-center'>Do you want to change your name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState)
                  }}
                  className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>
                  
                  {changeDetail ? 'Apply change' : 'Edit'}
                </span>
              </p>
              <p onClick={logoutUser} className='text-blue-600 hover:text-blue-700 cursor-pointer transition ease-in-out duration-200'>Sign out</p>
            </div>

          </form>

          <button type='submit' className='w-full bg-blue-600 text-white uppercase
          px-7 py-3 text-sm font-medium rounded shadow:md hover:bg-blue-700 transition duration-150 ease-in-out
          hover:shadow-lg active:bg-blue-800'>
            <Link to='/create-listing' className='flex justify-center items-center'>
              <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2' />
            Sell or rent your home
            </Link>
          </button>

        </div>
      </section>
      
      <div className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && userListings.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold mb-6 mt-6'>My Listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
               2xl-grid-cols-5'>
              {userListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={()=>onDelete(listing.id)}
                  onEdit={()=>onEdit(listing.id)}
                  
                
                />
              ))}
            </ul>
          </>
        )

        }
      </div>


      
    </>
  )
}

export default Profile;
