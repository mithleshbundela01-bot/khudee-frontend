import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import API
from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";

function Wishlist() {

  const { user } =
    useAuth();

  const [wishlist,
    setWishlist] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchWishlist();

  }, []);

  const fetchWishlist =
    async () => {

      try {

        const res =
          await API.get(

            `/auth/wishlist/${user.user._id}`

          );

        setWishlist(
          res.data.wishlist
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  const removeWishlist =
    async (
      productId
    ) => {

      try {

        await API.post(

          "/auth/wishlist",

          {

            userId:
              user.user._id,

            productId,

          }
        );

        setWishlist(

          wishlist.filter(

            (item) =>

              item._id !==
              productId
          )
        );

      } catch (error) {

        console.log(error);

      }
    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-4xl font-black">

        Loading Wishlist...

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 p-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-12">

          <h1 className="text-5xl font-black">

            My Wishlist ❤️

          </h1>

          <Link
            to="/products"
            className="bg-black text-white px-6 py-4 rounded-2xl font-bold"
          >

            Explore More

          </Link>

        </div>

        {wishlist.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-20 text-center">

            <h2 className="text-4xl font-black">

              Wishlist Empty

            </h2>

            <p className="mt-4 text-gray-500 text-lg">

              Save your favorite Khudee tees ❤️

            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-3 gap-8">

            {wishlist.map(
              (product) => (

                <div
                  key={product._id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >

                  <img
                    src={
                      product.variants?.[0]
                        ?.images?.[0]
                    }
                    alt={
                      product.name
                    }
                    className="w-full h-96 object-cover"
                  />

                  <div className="p-6">

                    <h2 className="text-2xl font-black">

                      {product.name}

                    </h2>

                    <p className="mt-3 text-gray-500">

                      ₹{product.price}

                    </p>

                    <div className="mt-6 flex gap-4">

                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 bg-black text-white text-center py-3 rounded-2xl font-bold"
                      >

                        View Product

                      </Link>

                      <button
                        onClick={() =>
                          removeWishlist(
                            product._id
                          )
                        }
                        className="px-5 rounded-2xl border font-bold"
                      >

                        Remove

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Wishlist;