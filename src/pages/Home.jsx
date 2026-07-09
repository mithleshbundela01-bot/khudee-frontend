import {
  useEffect,
  useState,
} from "react";

import API
from "../services/api";

import ProductCard
from "../components/ProductCard";

function Home() {

  const [products,
    setProducts] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

  const fetchProducts =
    async () => {

      try {

        const res =
          await API.get(
            "/products/live/all"
          );

        setProducts(
          res.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  fetchProducts();

}, []);

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50">

      {/* HERO SECTION */}

      <section className="px-8 md:px-20 py-20">

        <div className="max-w-5xl">

          <h1 className="text-6xl md:text-8xl font-black leading-tight text-gray-900">

            STREETWEAR
            <br />

            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">

              REDEFINED

            </span>

          </h1>

          <p className="mt-8 text-xl text-gray-600 max-w-2xl leading-relaxed">

            Premium oversized essentials crafted for modern street culture.
            Minimal fits. Maximum presence.

          </p>

          <a
            href="#products"
            className="inline-block mt-10 bg-gradient-to-r from-blue-600 to-green-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:scale-105 transition duration-300 shadow-lg"
          >

            Shop Now

          </a>

        </div>

      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="px-8 md:px-20 pb-20"
      >

        <div className="flex items-center justify-between mb-12">

          <h2 className="text-5xl font-black text-gray-900">

            Latest Drops 🔥

          </h2>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="text-center text-2xl font-bold py-20">

            Loading Products...

          </div>

        ) : products.length === 0 ? (

          <div className="text-center py-20">

            <h3 className="text-3xl font-bold text-gray-700">

              No products available yet

            </h3>

            <p className="mt-4 text-gray-500">

              New drops coming soon 🔥

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {products.map(
              (product) => (

                <ProductCard
                  key={
                    product._id
                  }
                  product={product}
                />

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default Home;