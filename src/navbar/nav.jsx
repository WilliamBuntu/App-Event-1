import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from '../utils/Logout';


const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const userRole = localStorage.getItem('userRole')

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between gradient p-4 z-40">
      <div className="flex items-center  space-x-9">
        <div className="flex items-center space-x-3">
          <div className="flex">
            <h3 className="text-white xl:text-xl hidden xl:block">Platfom Events</h3>
          </div>
        </div>
      </div>

      <div>
        <div className="xl:hidden">
          <button
            className="text-white font-work-sans text-2xl "
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            Menu
          </button>
        </div>

        <div
          data-testid="menu"
          className={`${isMenuOpen ? "block" : "hidden"
            } xl:flex items-center text-white cursor-pointer list-none gradient transition-all ease-in-out duration-300 xl:space-x-4 xl:ml-3 absolute left-0 w-full xl:w-auto xl:static xl:h-auto xl:bg-transparent mt-6 xl:mt-0`}
        >
          {userRole !== 'Admin' && (
            <>
              <li className="y-6 xl:my-0 ml-2 mr-4 my-6">
                <Link
                  to="/buyerDash"
                  className={`my-6 xl:my-0 no-underline text-white ml-2 mr-4 ${location.pathname === "/buyerDash" ? "border-b-2 pb-2" : ""
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li className="y-6 xl:my-0 ml-4 my-8 ">
                <Link
                  to="/myBooking"
                  className={`my-6 xl:my-0 no-underline text-white mr-4 ${location.pathname === "/myBooking" ? "border-b-2 pb-2" : ""
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Booking
                </Link>
              </li>
            </>
          )}
          {userRole === 'Admin' && (
            <>
              <li className="y-6 xl:my-0 ml-4 my-8 ">
                <Link
                  to="/admin/dashboard"
                  className={`my-6 xl:my-0 no-underline text-white mr-4 ${location.pathname === "/admin/dashboard" ? "border-b-2 pb-2" : ""
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li className="y-6 xl:my-0 ml-4 my-8 ">
                <Link
                  to="/allBooking"
                  className={`my-6 xl:my-0 no-underline text-white mr-4 ${location.pathname === "/allBooking" ? "border-b-2 pb-2" : ""
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Booking
                </Link>
              </li>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 ml-3">
        <LogoutButton />
      </div>
    </nav>
  );
};

export default NavBar;
