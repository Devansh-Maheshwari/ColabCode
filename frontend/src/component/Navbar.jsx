import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi'; // Hamburger Icon
import { IoMdClose } from 'react-icons/io'; // Close Icon
import { useAuth } from '../context/auth'; // Import AuthContext

function Navbar() {
  const { isLoggedIn, logout } = useAuth(); // Access user and login state from AuthContext
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex justify-between items-center p-5 bg-gray-700 border-b border-gray-700 w-full relative">
      <div className="flex justify-between items-center w-full">
        {/* Left Side: "ColabCode" */}
        <div className="text-green-400 font-bold text-xl">ColabCode</div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-green-400 focus:outline-none">
            {isOpen ? <IoMdClose className="w-6 h-6" /> : <GiHamburgerMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navbar Links */}
        <ul className={`md:flex md:space-x-6 ${isOpen ? 'block' : 'hidden'} absolute md:static bg-gray-800 md:bg-transparent top-16 left-0 w-full md:w-auto md:flex-row flex flex-col items-center z-10`}>
          <li className="w-full text-center md:w-auto">
            <Link to="/post-challenge" className="block py-2 md:py-0 hover:text-green-500" onClick={() => setIsOpen(false)}>
              Post Problems
            </Link>
          </li>
          <li className="w-full text-center md:w-auto">
            <Link to="/explore" className="block py-2 md:py-0 hover:text-green-500" onClick={() => setIsOpen(false)}>
              Explore
            </Link>
          </li>
          <li className="w-full text-center md:w-auto">
            <Link to="/dashboard" className="block py-2 md:py-0 hover:text-green-500" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
          </li>
        </ul>

        {/* Right Side: Profile Icon or Login/Signup Links */}
        <div className="hidden md:flex items-center space-x-3">
          {/* If logged in, show the profile icon */}
          {isLoggedIn && (
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="rounded-full"
            />
          )}

          {/* If not logged in, show Login and Signup links */}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="block py-2 md:py-0 hover:text-green-500" onClick={toggleMenu}>
                Login
              </Link>
              <Link to="/signup" className="block py-2 md:py-0 hover:text-green-500" onClick={toggleMenu}>
                Signup
              </Link>
            </>
          ) : (
            <button onClick={logout} className="block py-2 md:py-0 hover:text-green-500">
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden flex flex-col items-center space-y-4 bg-gray-800 p-5 ${isOpen ? 'block' : 'hidden'} absolute top-16 left-0 w-full z-10`}>
        <Link to="/post-challenge" className="block py-2 md:py-0 hover:text-green-500" onClick={toggleMenu}>
          Post Problems
        </Link>
        <Link to="/explore" className="block py-2 md:py-0 hover:text-green-500" onClick={toggleMenu}>
          Explore
        </Link>
        <Link to="/dashboard" className="block py-2 md:py-0 hover:text-green-500" onClick={toggleMenu}>
          Dashboard
        </Link>

        {/* Conditional Login/Signup or Logout Links in Mobile */}
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="block py-2 md:py-0 hover:text-green-500" onClick={toggleMenu}>
              Login
            </Link>
            <Link to="/signup" className="block py-2 md:py-0 hover:text-green-500" onClick={toggleMenu}>
              Signup
            </Link>
          </>
        ) : (
          <button onClick={logout} className="block py-2 md:py-0 hover:text-green-500">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
