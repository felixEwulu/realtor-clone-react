import { async } from '@firebase/util'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useEffect,  useState } from 'react'
import { toast } from 'react-toastify'

const Contact = ({ listing, userRef }) => {
 const [message, setMessage] = useState('')
 const [landlord, setLandlord] = useState(null)

 useEffect(() => {
  const getLandlord = async () => {
   const docRef = doc(db, 'users', userRef)
   const docSnap = await getDoc(docRef)
   if (docSnap.exists()) {
    setLandlord(docSnap.data())
   } else {
    toast.error('Could not get landlord data')
   }

  }
  getLandlord()


 }, [userRef])


 const capitalizeFirstLetter = (words) => {
  const str = words.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g,
   match => match.toUpperCase());
  return str;
 }

 const onChange = (e) => {
  setMessage(e.target.value)
 }

 return (
  <>
   {landlord !== null && (
    <div className='flex flex-col w-full'>
     <p className='font-semibold mb-1 text-sm sm:text-[1rem]'>
      Contact {capitalizeFirstLetter(landlord.name)} for the {listing.name.toLowerCase()}</p>
     <div>
      <textarea name="message" id="message" rows="2"
       value={message} onChange={onChange}
       className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded
      transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'>

      </textarea>
     </div>
     <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}>
           <button className='w-full text-center mt-3 mb-6 px-7 py-3 bg-blue-600 text-white
       rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg transition duration-150 ease-in-out font-semibold'>
       Send Message

      </button>
     </a>
    
    </div>
   )}
  </>
  )
}

export default Contact