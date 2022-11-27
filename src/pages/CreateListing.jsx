import { useState } from "react"

const CreateListing = () => {
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
        discountedPrice: 0
    })
    const { type, name, bedrooms, bathrooms, packing, furnished,
        address, description, offer, regularPrice, discountedPrice} = formData;

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
  return (
      <main className="max-w-md mx-auto px-2">
          <h1 className="text-3xl text-center mt-6 font-bold">
              Create a Listing
          </h1>
          <form>
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
                      rent
                  </button>
              </div>

              <p className="text-lg mt-6 font-semibold"> Address</p>
              <textarea type="text" id="address" value={address} onChange={onChange}
                  placeholder='Address' required
                  className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300
                  rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white
                  focus:border-slate-600 mb-6'
              />

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
                      accept='.jpg,.png,.jpeg' required
                      className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded
                      transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
                  />
             </div>
              
              <button type="submit"
                  className="w-full mb-6 px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase
              rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg
              active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                  Create Listing
              </button>

          </form>
      </main>
  )
}

export default CreateListing