import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router";

const Navbar = () => {
  const [nav, setNav] = useState(false)
    const [pageState, setPageState] = useState('Sign in')
    const location = useLocation();
    const navigate = useNavigate();
    // update pagestate based on auth
 const auth = getAuth();
 
 const handleNav = () => {
  setNav(!nav )
 }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setPageState('Profile')
            } else {
                setPageState('Sign in')
            }
        })
    }, [auth])


    const pathMatchRoute = (route) => {
        if (route === location.pathname) {
            return true
        }
    }


  return (
      <div className="bg-white border-b shadow-sm
       sticky top-0 z-40">
          <header className="flex justify-between items-center
            px-3  py-3 max-w-6xl mx-auto">
              <div>
                  <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo"
                      className="h-5 cursor-pointer"
                  onClick={() =>navigate('/')}/>
              </div>

              {/* Navigation list menu */}
              
              <div>
                  <ul className="hidden space-x-10 md:flex">
                      <li className={`cursor-pointer py-3 text-sm font-semibold
                       text-gray-400 border-b-[3px] border-b-transparent
                       ${pathMatchRoute('/') && 'text-black border-b-red-500'}`}
                          onClick={() => navigate('/')}>
                          
                          Home</li>
                      
                      <li
                      className={`cursor-pointer py-3 text-sm font-semibold
                       text-gray-400 border-b-[3px] border-b-transparent
                       ${pathMatchRoute('/offers') && 'text-black border-b-red-500'}`}
                          onClick={() => navigate('/offers')}>
                          
                          Offers</li>
                      
                      <li
                      className={`cursor-pointer py-3 text-sm font-semibold
                       text-gray-400 border-b-[3px] border-b-transparent
                       ${(pathMatchRoute('/sign-in') || pathMatchRoute('/profile')) && 'text-black border-b-red-500'}`}
                          onClick={() => navigate('/profile')}>
                          
                          {pageState}
                      </li>
                  </ul>
     </div>

     <div onClick={handleNav} className='block md:hidden'>
      {!nav ? <AiOutlineMenu size={20} className="mr-4"/> : <AiOutlineClose size={20}/>  }
     
     </div>
     
     <div className={!nav ? 'fixed left-[-100%]' : "fixed left-0 top-0 w-[80%] h-full border-r border-r-sm bg-white  duration-700 ease-in-out "}>

        <div className="p-6">
                  <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo"
                      className="h-5 cursor-pointer"
        onClick={() => {
         navigate('/')
        setNav(false)
        }} />
              </div>

              <ul className="p-6 uppercase ">
                      <li className={`cursor-pointer py-3 text-[16px] font-semibold
                       text-gray-400 border-b-[3px] border-b-transparent
                       ${pathMatchRoute('/') && 'text-black border-b-red-500'}`}
        onClick={() => {
         navigate('/')
        setNav(false)
        }}
       >
                          
                          Home</li>
                      
                      <li
                      className={`cursor-pointer py-3 text-[16px] font-semibold
                       text-gray-400 border-b-[3px] border-b-transparent
                       ${pathMatchRoute('/offers') && 'text-black border-b-red-500'}`}
        onClick={() => {
         navigate('/offers')
        setNav(false)
        }}
       >
                          
                          Offers</li>
                      
                      <li
                      className={`cursor-pointer py-3 text-[16px] font-semibold
                       text-gray-400 border-b-[3px] border-b-transparent
                       ${(pathMatchRoute('/sign-in') || pathMatchRoute('/profile')) && 'text-black border-b-red-500'}`}
        onClick={() => {
         navigate('/profile')
        setNav(false)
        }}
       >
                          
                          {pageState}
                      </li>
                  </ul>
     </div>

          </header>
    </div>
  )
}

export default Navbar