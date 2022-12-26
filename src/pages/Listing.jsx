import { getDoc, doc } from 'firebase/firestore'
import { useState , useEffect} from 'react'
import { useParams } from 'react-router'
import Spinner from '../components/Spinner'
import { db } from '../firebase'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, {EffectFade, Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css/bundle';
import { FaShare } from 'react-icons/fa'

const Listing = () => {
 const params = useParams()
 const [listing, setListing] = useState(null)
 const [loading, setLoading] = useState(true)
 const [shareLinkCopied, setShareLinkCopied] = useState(false)
 SwiperCore.use([Autoplay, Navigation, Pagination]);

 useEffect(() => {
  const fetchListing = async () => {
   const docRef = doc(db, 'listings', params.listingId)
   const docSnap = await getDoc(docRef);
   if (docSnap.exists()) {
    setListing(docSnap.data())
    setLoading(false)
    if(listing && (console.log(listing)))
    ;
   }
  }
  fetchListing()
 }, [params.listingId]);

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
        <p className='fixed top-[20%] right-[5%] font-semibold border-2 z-10 rounded-md bg-white p-2'>Link Copied</p>
       )
      }
    </main>
    )
  }
  </>
 
   
  )
}

export default Listing