import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product }) {
  const { user } = useAuth();

  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (!user?.user?._id) return;

        const res = await API.get(
          `/auth/wishlist/${user.user._id}`
        );

        const exists = res.data.wishlist.some(
          (item) => item._id === product._id
        );

        setWishlisted(exists);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWishlist();
  }, [user, product._id]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.user?._id) {
      alert("Please login first.");
      return;
    }

    try {
      await API.post("/auth/wishlist", {
        userId: user.user._id,
        productId: product._id,
      });

      setWishlisted((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Link to={`/product/${product._id}`}>
      <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition duration-500 hover:-translate-y-3">

        {/* WISHLIST HEART */}

        <button
          onClick={toggleWishlist}
          className="absolute top-5 right-5 z-20 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:scale-110 transition"
        >
          <Heart
            size={24}
            className={`transition ${
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-700"
            }`}
          />
        </button>

        {/* IMAGE */}

        <div className="overflow-hidden">
          <img
            src={product.variants[0].images[0]}
            alt={product.name}
            className="w-full h-[500px] object-cover group-hover:scale-110 transition duration-700"
          />
        </div>

        {/* CONTENT */}

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {product.name}
          </h2>

          <p className="text-gray-500 mt-3 leading-relaxed">
            Premium oversized streetwear essential.
          </p>

          <div className="flex items-center justify-between mt-6">
            <p className="text-2xl font-black text-green-600">
              ₹{product.price}
            </p>

            <button
              type="button"
              className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
            >
              View Product
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;