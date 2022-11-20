import { useState } from "react"
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import {Link, useNavigate} from 'react-router-dom'
import OAuth from "../components/OAuth";
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';

const SignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState, //Get the previous values which were set
                    // use Spread operator to add those values here so that they are not lost
      [e.target.id]: e.target.value,
    }))
  }

  const changeView = () => {
    setShowPassword(prevState => !prevState)
  }

  const signInUser = async (e) => {
    e.preventDefault()
   
    try {
       const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) navigate('/');


    } catch (error) {
      toast.error('Wrong user credentials')
    }
  }



  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign In</h1>
      <div
        className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl
           mx-auto">
        
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cmVhbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=700&q=60"
            className="w-full rounded-2xl" alt="key" />
        </div>

        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">

          <form onSubmit={signInUser}>
            <input  type="email" id="email"
              value={email}
              onChange={handleChange}
              placeholder='Email address'
              className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white
            border-gray-300 rounded transition ease-in-out"/>

            <div className="relative mb-6">
              <input type={showPassword ? 'text' : 'password'}
                id="password"
              value={password}
              onChange={handleChange}
              placeholder='Password'
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white
            border-gray-300 rounded transition ease-in-out"/>
              {showPassword ? <AiFillEyeInvisible className="absolute right-3 top-3 text-xl cursor-pointer"
              onClick={changeView}/>
                : <AiFillEye className="absolute right-3 top-3 text-xl cursor-pointer"
                onClick={changeView}/>}
            </div>

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">Don't have an account?
                <Link to='/sign-up'
                  className="text-red-600 hover:text-red-700
                   transition duration-200 ease-in-out ml-1"
                >Register</Link>
              </p>
              <p>
                <Link to='/forgot-password'
                className="text-blue-600 hover:text-blue-700
                   transition duration-200 ease-in-out ml-1">Forgot password?</Link>
              </p>
            </div>
               <button className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium
          uppercase rounded shadow-md hover:bg-blue-700
          transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800" type="submit">
            Sign In</button>
          
          <div className="flex my-4 items-center before:border-t before:flex-1 before:border-gray-300
          after:border-t after:flex-1 after:border-gray-300">
            <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth/>
          </form>

       


        </div>
      </div>
    </section>
  )
}

export default SignIn