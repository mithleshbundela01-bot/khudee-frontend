import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";


function Navbar() {

  const { cartItems } = useCart();

  const { user, logout } = useAuth();

  const navigate =
  useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

const menuRef = useRef(null);

useEffect(() => {

  const closeMenu = (e) => {

    if (
      menuRef.current &&
      !menuRef.current.contains(e.target)
    ) {

      setOpenMenu(false);

    }

  };

  document.addEventListener(
    "mousedown",
    closeMenu
  );

  return () =>
    document.removeEventListener(
      "mousedown",
      closeMenu
    );

}, []);

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (

    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">

      {/* LOGO */}

      <Link to="/">

        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">

          KhuDee

        </h1>

      </Link>

      {/* NAV LINKS */}

      <div className="flex items-center gap-8 text-lg font-medium text-gray-700">
        {user?.user?.isAdmin && (

  <button
  onClick={() =>
    navigate("/admin")
  }
  className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
>

  Admin Dashboard

</button>

)}
        <Link
          to="/"
          className="hover:text-green-500 transition duration-200"
        >
          Home
        </Link>

        

        {/* CART */}

        <Link
          to="/cart"
          className="relative hover:text-green-500 transition duration-200"
        >

          🛒 Cart

          {totalItems > 0 && (

            <span className="absolute -top-3 -right-5 bg-gradient-to-r from-blue-600 to-green-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-md">

              {totalItems}

            </span>

          )}

        </Link>

        {/* AUTH */}

        {user ? (

          <div
  ref={menuRef}
  className="relative"
>

  <button
    onClick={() =>
      setOpenMenu(!openMenu)
    }
    className="flex items-center gap-3"
  >

    <img
      src={
        user.user.profileImage ||

        "https://ui-avatars.com/api/?name=" +

          encodeURIComponent(
            user.user.name
          )
      }
      alt="profile"
      className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
    />

    <span className="font-bold">

      {user.user.name}

    </span>

  </button>

  {openMenu && (

    <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border overflow-hidden">

      <Link
        to="/profile"
        onClick={() =>
          setOpenMenu(false)
        }
        className="block px-6 py-4 hover:bg-gray-100"
      >
        👤 My Profile
      </Link>

      <Link
        to="/wishlist"
        onClick={() =>
          setOpenMenu(false)
        }
        className="block px-6 py-4 hover:bg-gray-100"
      >
        ❤️ Wishlist
      </Link>

      <Link
        to="/profile"
        onClick={() =>
          setOpenMenu(false)
        }
        className="block px-6 py-4 hover:bg-gray-100"
      >
        📦 My Reservations
      </Link>

      <button
        onClick={() => {

          logout();

          setOpenMenu(false);

        }}
        className="w-full text-left px-6 py-4 text-red-600 hover:bg-red-50"
      >
        🚪 Logout
      </button>

    </div>

  )}

</div>

        ) : (

          <div className="flex items-center gap-4">

            <Link
              to="/login"
              className="hover:text-green-500 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
            >

              Register

            </Link>

          </div>

        )}

      </div>

    </nav>
  );
}

export default Navbar;