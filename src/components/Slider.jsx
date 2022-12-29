import { useEffect, useState } from 'react'
import { collection, orderBy, query, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import Spinner from './Spinner'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, {
 EffectFade, Autoplay, Navigation, Pagination
} from 'swiper';
import 'swiper/css/bundle';
import {useNavigate} from 'react-router-dom'

const Slider = () => {
 const [userListings, setUserListings] = useState(null);
 const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 SwiperCore.use([Autoplay, Navigation, Pagination]);

 useEffect(() => {
  const fetchListings = async () => {
   const listingsRef = collection(db, 'listings')
   const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
   const querySnap = await getDocs(q)
   let listings = []
   querySnap.forEach(doc => {
    return listings.push({
     id: doc.id,
     data: doc.data(),
    })
   })
   setUserListings(listings)
   setLoading(false)

  }
  fetchListings();
 }, []);

 if (loading) return <Spinner />

 if (userListings.length === 0) return <></>;

 
 return (
  userListings && (
   <>
       <Swiper
         slidesPerView={1}
         navigation
         pagination={{ type: 'progressbar' }}
         effect='fade'
         modules={[EffectFade]}
         autoplay={{delay:3000}}
       >
         {userListings.map(({ data, id }) => (
           <SwiperSlide key={id} onClick={()=> navigate(`/category/${data.type}/${id}`)}>
             <div style={{ background: `url(${data.imgUrls[0]}) center, no-repeat`, backgroundSize: 'cover' }}
             className='relative w-full h-[300px] overflow-hidden'>
               
             </div>
             <p className='text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d]
             shadow-lg opacity-90 p-2 rounded-br-3xl'>
               {data.name}</p>
             
             <p className='text-[#f1faee] absolute left-1 bottom-1 font-medium max-w-[90%] bg-[#e63946]
             shadow-lg opacity-90 p-2 rounded-tr-3xl'>
               &#8358;{(data.discountedPrice
                 ?? data.regularPrice)
                 .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
               }
              {data.type === 'rent' && ' / year'}
             </p>
           </SwiperSlide>
         ))}
  </Swiper>
   
   </>
   )
  )
}

export default Slider