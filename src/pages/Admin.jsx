import {
  useEffect,
  useState,
} from "react";

import { useNavigate }
from "react-router-dom";

import API
from "../services/api";

import { useAuth }
from "../context/AuthContext";

import { Link }
from "react-router-dom";


function Admin() {

  const { user } =
    useAuth();


  const [
    products,
    setProducts,
  ] = useState([]);

  const navigate =
  useNavigate();
  // FETCH DATA

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          // PRODUCTS

          const productRes =
            await API.get(
              "/products"
            );

          setProducts(
            productRes.data
            
          );

        } catch (error) {

          console.log(error);

        }
      };

    fetchData();

  }, []);

  

  // DELETE PRODUCT

  const handleDeleteProduct =
    async (id) => {

      try {

        await API.delete(
          `/products/${id}`
        );

        setProducts(
          products.filter(
            (product) =>
              product._id !== id
          )
        );

        alert(
          "Product deleted successfully"
        );

      } catch (error) {

        console.log(error);

      }
    };

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 p-10">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">

        <h1 className="text-5xl font-black">

          KhuDee Admin Dashboard

        </h1>

        <Link
          to="/admin/add-product"
          className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition inline-block"
        >

          + Add Product

        </Link>

         <Link
      to="/admin/orders"
      className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition inline-block"
    >

      View Orders

    </Link>

    <Link
  to="/admin/analytics"
  className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition inline-block"
>

  Analytics

</Link>

      </div>



      {/* PRODUCTS */}

<div>

  <h2 className="text-4xl font-black mb-10">

    Products

  </h2>

  {products.length === 0 ? (

    <div className="bg-white p-10 rounded-3xl shadow-xl text-center">

      <h3 className="text-3xl font-black text-gray-700">

        No products yet

      </h3>

      <p className="mt-4 text-gray-500">

        Add your first product 🔥

      </p>

    </div>

  ) : (

    <div className="grid md:grid-cols-3 gap-8">

      {products.map(
        (product) => {

          const firstImage =
            product?.variants?.[0]
              ?.images?.[0] ||
            "https://via.placeholder.com/400x500?text=No+Image";

          return (

            <div
              key={product._id}
              className="bg-white p-6 rounded-3xl shadow-xl"
            >

              <img
                src={firstImage}
                alt={product.name}
                className="w-full h-72 object-cover rounded-2xl"
              />

              <h3 className="text-2xl font-black mt-6">

                {product.name}

              </h3>

              <p className="text-gray-500 mt-2">

                ₹{product.price}

              </p>

              <div className="flex items-center justify-between mt-4">

                <span className="bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold">

                  {product?.status || "Live"}

                </span>

                {product?.featured && (

                  <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold">

                    Featured

                  </span>

                )}

              </div>

              <div className="mt-4">

                <p className="font-semibold text-gray-700">

                  Variants:
                </p>

                <div className="flex flex-wrap gap-2 mt-2">

                  {product?.variants?.map(
                    (
                      variant,
                      index
                    ) => (

                      <span
                        key={index}
                        className="bg-black text-white px-3 py-1 rounded-full text-sm"
                      >

                        {variant.color}

                      </span>

                    )
                  )}

                </div>

              </div>

              <div className="flex gap-4 mt-6">

                <button
  onClick={() =>
    navigate(
      `/admin/edit-product/${product._id}`
    )
  }
  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold"
>

  Edit

</button>

                <button
                  onClick={() =>
                    handleDeleteProduct(
                      product._id
                    )
                  }
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold"
                >

                  Delete

                </button>

              </div>

            </div>

          );
        }
      )}

    </div>

  )}

</div>

    </div>

  );
}

export default Admin;