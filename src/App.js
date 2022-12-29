import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Navbar from "./components/Navbar";
import Category from "./pages/Category";

function App() {
	return (
		<>
			<Router>
				<Navbar/>
				<Routes>
					<Route path="/" element={<Home />} />

					<Route path="/profile" element={<PrivateRoute />}>
						{/* this route gets called if the user is logged in */}
						<Route path="/profile" element={<Profile />} />
					</Route>

					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/offers" element={<Offers />} />
					<Route path="/category/:categoryName" element={<Category/>} />
					<Route path="/category/:categoryName/:listingId" element={<Listing />} />

					<Route path="/create-listing" element={<PrivateRoute />}>
						<Route path="/create-listing" element={<CreateListing />} />
					</Route>

					<Route path="/edit-listing" element={<PrivateRoute />}>
						<Route path="/edit-listing/:listingId" element={<EditListing />} />
					</Route>
				</Routes>
			</Router>

			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			{/* Same as */}
			<ToastContainer />
		</>
	);
}

export default App;
