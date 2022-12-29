import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import {toast} from 'react-toastify'
import ListingItem from "../components/ListingItem"
import Spinner from "../components/Spinner"
import { db } from "../firebase"
const Offers = () => {
  const [offersListings, setOffersListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, 'listings')
        const q = query(listingRef, where('offer', '==', true),
          orderBy('timestamp', 'desc'), limit(8));
        const querySnap = await getDocs(q);
        // load more variable to get
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible);

        const listings = [];
        querySnap.forEach(doc => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setOffersListings(listings)
        setLoading(false)
      } catch (error) {
        
      }
    }
    fetchListings()
  }, []);

  const onFetchMoreListings =async () => {
    try {
        const listingRef = collection(db, 'listings')
        const q = query(listingRef, where('offer', '==', true),
          orderBy('timestamp', 'desc'), startAfter(lastFetchedListing), limit(8));
        const querySnap = await getDocs(q);
        // load more variable to get
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible);

        const listings = [];
        querySnap.forEach(doc => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
      setOffersListings((prevState) => [
        ...prevState,
        ...listings
        ])
        setLoading(false)
      } catch (error) {
        
      }
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 mb-6 font-bold">Offers</h1>
      {loading ? (
        <Spinner/>
      ) : offersListings && offersListings.length > 0 ? (
          <>
            <main>
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {offersListings.map(({id, data}) => (
                  <ListingItem
                    key={id}
                    listing={data}
                    id={id}
                  />
                ))

                }
              </ul>
            </main>

            {lastFetchedListing && (
              <div className="flex justify-center items-center">
                <button onClick={onFetchMoreListings} className="bg-white px-3 py-1.5 text-gray-700 border
                border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition
                duration-150 ease-in-out">Load more</button>
              </div>
            )}
            

          </>
        ): (
            <p>There are no current offers</p>
      )
      
      }
    </div>
  )
}

export default Offers