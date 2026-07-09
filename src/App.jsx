import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import ForgotPassword
from "./pages/ForgotPassword";
import AddProduct
from "./pages/AddProduct";
import Orders
from "./pages/Orders";
import ReserveSuccess
from "./pages/ReserveSuccess";
import Analytics
from "./pages/Analytics";
import Profile
from "./pages/Profile";
import Wishlist
from "./pages/Wishlist";

function App() {

  return (

    <div className="min-h-screen bg-white">

      {/* NAVBAR */}

      <Navbar />

      {/* CART DRAWER */}

      <CartDrawer />

      {/* ROUTES */}

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* PRODUCT DETAILS */}

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* CART */}

        <Route
          path="/cart"
          element={<CartPage />}
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/forgot-password"
          element={
         <ForgotPassword />
         }
        />

        <Route
          path="/admin/add-product"
          element={<AddProduct />}
        />

      <Route
  path="/admin/edit-product/:id"
  element={<AddProduct />}
/>

         <Route
  path="/admin/orders"
  element={<Orders />}
/>

         <Route
  path="/reserve-success"
  element={<ReserveSuccess />}
/>

<Route
  path="/admin/analytics"
  element={<Analytics />}
/>

<Route
  path="/profile"
  element={<Profile />}
/>

<Route
  path="/wishlist"
  element={<Wishlist />}
/>

      </Routes>

    </div>
  );
}

export default App;