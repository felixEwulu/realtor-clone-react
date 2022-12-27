import { getDoc, doc } from 'firebase/firestore'
import { useState , useEffect} from 'react'
import { useParams } from 'react-router'
import Spinner from '../components/Spinner'
import { db } from '../firebase'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa'
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact'
import Map from '../components/Map'



const Listing = () => {
  const auth = getAuth();
 const params = useParams()
 const [listing, setListing] = useState(null)
 const [loading, setLoading] = useState(true)
 const [shareLinkCopied, setShareLinkCopied] = useState(false)
 const [contactLandlord, setContactLandlord] = useState(false)

 SwiperCore.use([Autoplay, Navigation, Pagination]);

 useEffect(() => {
  const fetchListing = async () => {
   const docRef = doc(db, 'listings', params.listingId)
   const docSnap = await getDoc(docRef);
   if (docSnap.exists()) {
    setListing(docSnap.data())
    setLoading(false)
    ;
   }
  }
  fetchListing()
 }, [params.listingId]);
  
  const renderContactForm = () => {
    setContactLandlord(true)
  }

 

 if (loading) {
  return <Spinner />
 }

 return (
  <>
  {
    listing && (
       <main>
     <Swiper slidesPerView={1}
      navigation
      pagination={{ type: 'progressbar' }}
      effect='fade'
      modules={[EffectFade]}
      autoplay={{ delay:3000 }}
     >

      {listing.imgUrls.map((url, index) => (
       <SwiperSlide key={index}>
        <div className=' relative w-full overflow-hidden h-[300px]' style={{
         background: `url(${listing.imgUrls[index]}) center no-repeat`,
        backgroundSize: 'cover'}}>
       
       </div>
       
       </SwiperSlide>
      ))}
      </Swiper>

      <div className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer
      borer-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
       onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true)
        setTimeout(() => {
         setShareLinkCopied(false);
        }, 2000)
      }}>
       <FaShare className='text-lg text-slate-500'/>
      </div>
      {
       shareLinkCopied && (
               <p
                 className='fixed top-[20%] right-[5%] font-semibold border-2 z-10 rounded-md bg-white p-2'>
                 Link Copied
               </p>
       )}

           <div className='m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg
           bg-white lg:space-x-5'>
             
             <div className='w-full mb-6'>
               <p className='text-2xl font-bold mb-3 text-blue-900'>
                 {listing.name} - $ {listing.offer ?
                 listing.discountedPrice
                 .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ','):
                 listing.regularPrice
               .toString()
                     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                 {listing.type === 'rent' ? '/ month' : ''}
               </p>

               <p className='flex items-center mt-6 mb-3 font-semibold'>
                 <FaMapMarkerAlt className='text-green-700 mr-1'/>
                 {listing.address}
               </p>
               
               <div className='flex justify-start items-center space-x-4 w-[75%]'>
                 <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white
                 text-center font-semibold shadow-md'>
                   {listing.type === 'rent' ? 'Rent' : 'Sale'}
                 </p>

                 {listing.offer && (
                   <div className='w-full max-w-[200px] whitespace-nowrap bg-green-800 rounded-md p-2
                 text-white text-center font-semibold shadow-md'>
                     <p>${ +listing.regularPrice - +listing.discountedPrice} discount</p>
                     
                   </div>
                 )
                 
                 }
                 
               </div>
               
               <p className='mt-3 mb-3'>
                 <span className='font-semibold'>Description -</span>
                 { listing.description}
               </p>

               <ul className='flex flex-wrap sm:flex-nowrap items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6'>
                 <li className='flex items-center  whitespace-nowrap'>
                  <FaBed className='text-lg mr-1'/>
                   {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
                 </li>

                 <li className='flex items-center whitespace-nowrap'>
                  <FaBath className='text-lg mr-1'/>
                   {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : '1 Bath'}
                 </li>

                 <li className='flex items-center whitespace-nowrap'>
                  <FaParking className='text-lg mr-1'/>
                   {+listing.parking ? 'Parking Spot' : 'No Parking'}
                 </li>

                 <li className='flex items-center whitespace-nowrap'>
                  <FaChair className='text-lg mr-1'/>
                   {+listing.furnished ? 'Furnished' : 'Not Furnished'}
                 </li>
               </ul>

               {/* this can only be seen by visitors who haven't logged  */}
               {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
               
                 <div className='mt-6'>
                 <button onClick={renderContactForm} className='px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase 
               shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 w-full text-center transition duration-150 ease-in-out '>
                 Contact Landlord</button>
               </div>
                 
               )}

               { listing && contactLandlord &&
                 <Contact
                 userRef = {listing.userRef}
                 listing = {listing}
                 />
                 
               }

               
             </div>

             <div className=' w-full h-[300px] md:h-[400px] z-10 overflow-x-hidden mt-6 lg:mt-0 md:ml-2'>

               {listing.geolocation && (
                 <Map geolocation={listing.geolocation } />
               )
                 
               }
               
               
             </div>
      </div>
           
    </main>
    )
  }
  </>
 
   
  )
}

export default Listing