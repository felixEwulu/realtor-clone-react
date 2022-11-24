import { getAuth } from 'firebase/auth';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate()
 
  const [ inputData, setInputData ] = useState({
    userName: auth?.currentUser.displayName,
    userEmail: auth?.currentUser.email,
  })

  const { userName, userEmail } = inputData || {};

  const logoutUser = () => {
    auth.signOut();
    navigate('/');

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
              value={userName} disabled
              className='w-full mb-6  px-4 py-2 text-xl text-gray-700
               bg-white border border-gray-300 rounded transition ease-in-out'
            />

            
            {/* Email input */}
            <input
              type="email"
              id='email'
              value={userEmail} disabled
              className='w-full mb-6 px-4 py-2 text-xl text-gray-700
               bg-white border border-gray-300 rounded transition ease-in-out'
            />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className='flex items-center'>Do you want to change your name?
                <span className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>Edit</span>
              </p>
              <p onClick={logoutUser} className='text-blue-600 hover:text-blue-700 cursor-pointer transition ease-in-out duration-200'>Sign out</p>
            </div>

          </form>
        </div>
    </section>
    </>
  )
}
