import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, getDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';


const EditListing = () => {
    const navigate = useNavigate()
    const auth = getAuth()
    const [geolocationEnabled, setGeolocationEnabled] = useState(false)
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [formData, setFormData] = useState({
        type: 'sale',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        packing: false,
        furnished: true,
        address: '',
        description: '',
        offer: true,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {},
    })
    const { type, name, bedrooms, bathrooms, packing, furnished,
        address, description, offer, regularPrice, discountedPrice, latitude, longitude, images} = formData;

 // used to get the ending part of a unique url
 const params = useParams();    

    useEffect(() => {
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error(`You can't edit this listing`)
            navigate('/');
        }
    }, [params.listingId, listing, navigate])
 
 useEffect(() => {
  setLoading(true)
  const fetchListing = async () => {
   
      const docRef = doc(db, 'listings', params.listingId)
   const docSnap = await getDoc(docRef);
   if (docSnap.exists()) {
       setListing(docSnap.data());
    //    console.log(listing);
    setFormData({ ...docSnap.data() })
    setLoading(false)
   } else {
    navigate('/')
    toast.error('listing does not exist')
   }
       
      }
  fetchListing();
 }, [navigate, params.listingId])
    
    

 
    const onChange = (e) => {
        // based on the input, we change the boolean value
        let boolean = null;
        if (e.target.value === 'true') boolean = true;
        if (e.target.value === 'false') boolean = false;

        // files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }
        // text, boolean or numbers
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (+discountedPrice >= +regularPrice) {
            setLoading(false);
            toast.error('DIscounted price needs to be less than regular price!')
            return;
        }
        
        if (images.length > 6) {
            setLoading(false);
            toast.error('maximum 6 images are allowed')
            return;
        }

        let geolocation = {};
        let location;
        if (!geolocationEnabled) {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload is ${progress}% done`);
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                              
                        }

                    },
                    (error) => {
                        reject(error)
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        })
                    }
                
                )  

            })
        }

        const imgUrls = await Promise.all(
            [...images].map(img => storeImage(img))
        ).catch(error => {
            console.log(error);
            setLoading(false);
            toast.error('Images not uploaded')
            return;
        })

        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        };
        delete formDataCopy.images;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;

        // updates firestore database
        const docRef = doc(db, 'listings', params.listingId);
        await updateDoc(docRef, formDataCopy);
        toast.success('listing Updated');
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)


    }

    if (loading) {
        return <Spinner/>
    }


  return (
      <main className="max-w-md mx-auto px-2">
          <h1 className="text-3xl text-center mt-6 font-bold">
              Edit Listing
          </h1>
          <form onSubmit={onSubmit}>
              <p className="text-lg font-semibold">Sell/Rent</p>
              <div className="flex">
                  <button
                      type="button"
                      id="type"
                      value='sale'
                      onClick={onChange}
                      className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg
                      focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
                      ${type === 'sale' ? 'bg-slate-600 text-white' : 'bg-white text-black' }`}
                  >
                      Sell
                  </button>

                  <button
                      type="button"
                      id="type"
                      value='rent'
                      onClick={onChange}
                      className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg
                      focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
                      ${type === 'rent' ? 'bg-slate-600 text-white' : 'bg-white text-black' }`}
                  >
                      rent
                  </button>
              </div>

              <p className="text-lg mt-6 font-semibold"> Name</p>
              <input type="text" id="name" value={name} onChange={onChange}
                  placeholder='Property name' maxLength='32' minLength='10' required
                  className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
                  rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
                  focus:border-slate-600 mb-6'
              />

              <div className="flex space-x-6 mb-6">
                  <div>
                      <p className="text-lg font-semibold">Beds</p>
                      <input type="number" id="bedrooms" value={bedrooms}
                          onChange={onChange} min='1' max='15' required
                          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
                      rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                  </div>

                  <div>
                      <p className="text-lg font-semibold">Baths</p>
                      <input type="number" id="bathrooms" value={bathrooms}
                          onChange={onChange} min='1' max='15' required
                          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
                      rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                  </div>
              </div>

                  <p className="text-lg font-semibold">Packing spot</p>
              <div className="flex mb-6">
                  <button
                      type="button"
                      id="packing"
                      value={true}
                      onClick={onChange}
                      className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg
                      focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
                      ${packing ? 'bg-slate-600 text-white' : 'bg-white text-black' }`}
                  >
                      Yes
                  </button>

                  <button
                      type="button"
                      id="packing"
                      value={false}
                      onClick={onChange}
                      className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg
                      focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
                      ${!packing ? 'bg-slate-600 text-white' : 'bg-white text-black' }`}
                  >
                      no
                  </button>
              </div>

                  <p className="text-lg font-semibold">Furnished</p>
              <div className="flex">
                  <button
                      type="button"
                      id="furnished"
                      value={true}
                      onClick={onChange}
                      className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg
                      focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
                      ${furnished ? 'bg-slate-600 text-white' : 'bg-white text-black' }`}
                  >
                      yes
                  </button>

                  <button
                      type="button"
                      id="furnished"
                      value={false}
                      onClick={onChange}
                      className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg
                      focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
                      ${!furnished? 'bg-slate-600 text-white' : 'bg-white text-black' }`}
                  >
                      no
                  </button>
              </div>

              <p className="text-lg mt-6 font-semibold"> Address</p>
              <textarea type="text" id="address" value={address} onChange={onChange}
                  placeholder='Address' required
                  className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
                  rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
                  focus:border-slate-600 mb-6'
              />

              {!geolocationEnabled && (
                  
                  <div className="flex space-x-6 mb-6">
                      <div className="">
                          <p className="text-lg font-semibold">Latitude</p>
                          <input type="number" id="latitude" value={latitude} onChange={onChange} required
                              min='-90'
                              max='90'
                          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
                      rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                      </div>

                      <div className="">
                          <p className="text-lg font-semibold">Longitude</p>
                          <input type="number" id="longitude" value={longitude} onChange={onChange} required
                               min='-180'
                              max='180'
                          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
                      rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                      </div>
                      </div>
              )
                  
              }

              

              <p className="text-lg  font-semibold"> Description</p>
              <textarea type="text" id="description" value={description} onChange={onChange}
                  placeholder='Description' required
                  className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
                  rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
                  focus:border-slate-600 mb-6'
              />

               <p className="text-lg font-semibold">Offer</p>
              <div className="flex mb-6">
                  <button
                      type="button"
                      id="offer"
                      value={true}
                      onClick={onChange}
                      className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg
                      focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
                      ${!offer ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
                  >
                      Yes
                  </button>

                  <button
                      type="button"
                      id="offer"
                      value={false}
                      onClick={onChange}
                      className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-sm rounded hover:shadow-lg
                      focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
                      ${offer ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}
                  >
                      no
                  </button>
              </div>

                <div className="flex items-center mb-6">
              <div className="">
                  <p className="text-lg font-semibold">Regular price</p>
                  <div className="flex w-full justify-center items-center space-x-6">
                      <input type="number" id="regularPrice"
                              value={regularPrice}
                              min='50' max='400000000' required
                              onChange={onChange}
                          className="w-full px-4 py-2 text-xl text-gray-700 bg-white
                      border-gray-300 rounded transition duration-150 ease-in-out
                      focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                          
                          

                      {type === 'rent' && (
                          <div className="">
                              <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                          </div>
                      )}
                  </div>
              </div>
              </div>
                        {/* renders only when offer is true */}
              {offer && (
                        <div className="flex items-center mb-6">
              <div className="">
                  <p className="text-lg font-semibold">Discounted price</p>
                  <div className="flex w-full justify-center items-center space-x-6">
                      <input type="number" id="discountedPrice"
                                  value={discountedPrice}
                                  min='50' max='400000000' required={offer}
                                  onChange={onChange}
                          className="w-full px-4 py-2 text-xl text-gray-700 bg-white
                      border-gray-300 rounded transition duration-150 ease-in-out
                      focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>

                      {type === 'rent' && (
                          <div className="">
                              <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                          </div>
                      )}
                  </div>
              </div>
              </div>
              )
                  
             }

              <div className="mb-6">
                  <p className="text-lg font-semibold">Images</p>
                  <p className="text-gray-600">The first image will be the cover (max 6)</p>
                  <input type="file" id="images" onChange={onChange}
                      accept='.jpg,.png,.jpeg'
                      multiple
                      required
                      className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded
                      transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
                  />
             </div>
              
              <button type="submit"
                  className="w-full mb-6 px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase
              rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg
              active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                  Edit Listing
              </button>

          </form>
      </main>
  )
}

export default EditListing