import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import ListingItem from "../components/ListingItem"
import Slider from "../components/Slider"
import { db } from "../firebase"

const Home = () => {

  // Offers
  const [offers, setOffers] = useState(null)
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get doc reference
        const listingsRef = collection(db, 'listings');
        // create the query
        const q = query(listingsRef, where('offer', '==', true),
          orderBy('timestamp', 'desc'), limit(4));
        // execute the query: it gets the info and save inside the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach(doc => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setOffers(listings)
        
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchListings()
  }, [])

  // Places for rent
 const [rentListings, setRentListings] = useState(null)
  useEffect(() => {
    const fetchListings = async () => {
      const listingRef = collection(db, 'listings');
      const q = query(listingRef, where('type', '==', 'rent'), orderBy('timestamp', 'desc'), limit(4));
      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setRentListings(listings);
    }
    fetchListings()
  }, [])


  // Places for sale
  const [salesListing, setSalesListing] = useState(null);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, 'listings')
        const q = query(listingRef, where('type', '==', 'sale'), orderBy('timestamp', 'desc'), limit(4))
        const querySnap = await getDocs(q)
        const listings = [];
        querySnap.forEach( doc => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setSalesListing(listings)

      } catch (error) {
        console.log(error.message);
      }
    }
    fetchListings()
  }, [])

  return (
    <div>
      <Slider />
      {/* div containing offers, rent and sales */}
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {offers && offers.length > 0 && (
          // div for only offers
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent offers</h2>
            <Link to='/offers'>
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition
            duration-150 ease-in-out ">Show more offers</p>
            </Link>

            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offers.map(({ id, data }) => (
                
                <ListingItem
                  key={id}
                  id={id}
                  listing={data}
                  
                />
               
              ))}
            </ul>

          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          // div for places for rent
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Places for rent</h2>
            <Link to='/category/rent'>
            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition
            duration-150 ease-in-out">Show more places for rent</p>
            </Link>

            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentListings.map(({ id, data }) => (
                
                <ListingItem
                  key={id}
                    listing={data}
                    id={id}
                  />

              ))}
            </ul>

          </div>
        )}

        {salesListing && salesListing.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Places for sale</h2>
            <Link to='/category/sale'>
            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition
            duration-150 ease-in-out">Show more places for sale</p>

            </Link>

           <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
               {salesListing.map(({ id, data }) => (
              
                <ListingItem
                key={id}
                listing={data}
                id={id} />
              
            ))

            }
            </ul>
           
          </div>
        )

        }

      </div>
    </div>
  )
}

export default Home