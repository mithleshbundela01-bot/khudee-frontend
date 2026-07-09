import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import API
from "../services/api";

import { useCart }
from "../context/CartContext";

import {
  Heart,
} from "lucide-react";

import {
  useAuth,
} from "../context/AuthContext";

function ProductDetails() {

  const { id } =
    useParams();

  const { addToCart } =
    useCart();

  const [product,
    setProduct] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const [selectedVariant,
    setSelectedVariant] =
    useState(null);

  const [activeImage,
    setActiveImage] =
    useState("");

  const [selectedSize,
    setSelectedSize] =
    useState("");

    const [wishlist,
  setWishlist] =
  useState([]);

  const { user } =
  useAuth();

  const toggleWishlist =
  async () => {

    try {

      if (
        !user?.user?._id
      ) {

        alert(
          "Please login first"
        );

        return;
      }

      await API.post(

        "/auth/wishlist",

        {

          userId:
            user.user._id,

          productId:
            product?._id,

        }
      );

      const exists =
        wishlist?.find(

          (item) =>

            item._id ===
            product?._id
        );

      if (exists) {

        setWishlist(

          wishlist.filter(

            (item) =>

              item._id !==
              product?._id
          )
        );

      } else {

        setWishlist([
          ...wishlist,
          product,
        ]);

      }

    } catch (error) {

      console.log(error);

    }
  };
// FETCH PRODUCT

useEffect(() => {

  

  const fetchWishlist =
    async () => {

      try {

        if (
          !user?.user?._id
        ) return;

        const res =
          await API.get(

            `/auth/wishlist/${user.user._id}`

          );

        setWishlist(
          res.data.wishlist
        );

      } catch (error) {

        console.log(error);

      }
    };

  const fetchProduct =
    async () => {

      try {

        const res =
          await API.get(
            `/products/${id}`
          );

        setProduct(
          res.data
        );

        setSelectedVariant(
          res.data.variants[0]
        );

        setActiveImage(
          res.data.variants[0]
            .images[0]
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  fetchWishlist();

  fetchProduct();

}, [id, user]);

  // LOADING

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-4xl font-black">

        Loading...

      </div>

    );
  }

  // PRODUCT NOT FOUND

  if (!product) {

    return (

      <div className="min-h-screen flex items-center justify-center text-4xl font-black text-red-500">

        Product not found

      </div>

    );
  }

  // GET STOCK

  const getSizeStock =
    (size) => {

      const variant =
        product?.variants?.find(
          (v) =>
            v.color ===
            selectedVariant?.color
        );

      if (!variant)
        return 0;

      const sizeObj =
        variant.sizes.find(
          (s) =>
            s.size === size
        );

      return (
        sizeObj?.stock || 0
      );
    };

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 px-8 md:px-20 py-16">

      <div className="grid md:grid-cols-2 gap-16">

        {/* IMAGE SECTION */}

        <div>

          {/* MAIN IMAGE */}

          <img
            src={
              activeImage ||
              "https://via.placeholder.com/600"
            }
            alt={product.name}
            className="w-full rounded-3xl shadow-2xl"
          />

          {/* THUMBNAILS */}

          <div className="flex gap-4 mt-6 flex-wrap">

            {selectedVariant?.images?.map(
              (
                image,
                index
              ) => (

                <img
                  key={index}
                  src={image}
                  alt="Product"
                  onClick={() =>
                    setActiveImage(
                      image
                    )
                  }
                  className={`w-24 h-24 object-cover rounded-2xl cursor-pointer border-4 transition ${
                    activeImage === image
                      ? "border-black"
                      : "border-transparent"
                  }`}
                />

              )
            )}

          </div>

        </div>

        {/* DETAILS */}

        <div>

          <div className="flex items-center gap-4">

  <h1 className="text-4xl font-black">

    {product.name}

  </h1>

  <button
    onClick={
      toggleWishlist
    }
  >

    <Heart

      size={34}

      className={`

        transition

        ${
          wishlist.find(

            (item) =>

              item._id ===
              product._id
          )

            ? "fill-red-500 text-red-500"

            : "text-black"
        }

      `}
    />

  </button>

</div>

          <p className="mt-8 text-2xl text-gray-600 leading-relaxed">

            {product.description}

          </p>

          <p className="mt-10 text-5xl font-black text-green-600">

            ₹{product.price}

          </p>

          {/* COLORS */}

          <div className="mt-12">

            <h3 className="text-xl font-bold mb-5">

              Colors

            </h3>

            <div className="flex gap-4 flex-wrap">

              {product?.variants?.map(
                (
                  variant,
                  index
                ) => (

                  <button
                    key={index}
                    onClick={() => {

                      setSelectedVariant(
                        variant
                      );

                      setActiveImage(
                        variant.images[0]
                      );

                      setSelectedSize("");

                    }}
                    className={`px-8 py-3 rounded-full border-2 font-bold transition-all duration-300 ${
                      selectedVariant?.color ===
                      variant.color
                        ? "border-black bg-black text-white scale-105"
                        : "border-gray-300 bg-white hover:border-black"
                    }`}
                  >

                    {variant.color}

                  </button>

                )
              )}

            </div>

          </div>

          {/* SIZES */}

          <div className="mt-12">

            <h3 className="text-xl font-bold mb-5">

              Sizes

            </h3>

            <div className="flex gap-4 flex-wrap">

              {selectedVariant?.sizes?.map(
                (
                  sizeObj,
                  index
                ) => {

                  const outOfStock =
                    sizeObj.stock <= 0;

                  return (

                    <button
                      key={index}

                      disabled={
                        outOfStock
                      }

                      onClick={() =>
                        setSelectedSize(
                          sizeObj.size
                        )
                      }

                      className={`px-6 py-4 rounded-2xl border-2 font-bold transition-all duration-300 flex items-center gap-2

                      ${
                        selectedSize ===
                        sizeObj.size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white"
                      }

                      ${
                        outOfStock
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:border-black"
                      }`}
                    >

                      {sizeObj.size}

                      {outOfStock && (

                        <span className="text-red-500 text-sm font-bold">

                          Out

                        </span>

                      )}

                    </button>

                  );
                }
              )}

            </div>

          </div>

          {/* STOCK STATUS */}

            {selectedSize && (

  <div className="mt-6">

    {getSizeStock(
      selectedSize
    ) <= 0 ? (

      <p className="text-red-500 font-black text-xl">

        Out of Stock

      </p>

    ) : getSizeStock(
        selectedSize
      ) <= 3 ? (

      <div>

        <p className="text-red-500 font-black text-xl animate-pulse">

          Only {
            getSizeStock(
              selectedSize
            )
          } left 🔥

        </p>

        <p className="text-gray-500 mt-2">

          Selling fast

        </p>

      </div>

    ) : getSizeStock(
        selectedSize
      ) <= 10 ? (

      <p className="text-orange-500 font-black text-xl">

        Only {
          getSizeStock(
            selectedSize
          )
        } left

      </p>

    ) : (

      <p className="text-green-600 font-black text-xl">

        In Stock

      </p>

    )}

  </div>

)}

          {/* ADD TO CART */}

          <button

            disabled={
              !selectedSize ||
              getSizeStock(
                selectedSize
              ) <= 0
            }

            onClick={() => {

              if (
                !selectedSize
              ) {

                alert(
                  "Select a size"
                );

                return;
              }

              if (
                getSizeStock(
                  selectedSize
                ) <= 0
              ) {

                alert(
                  "Out of stock"
                );

                return;
              }

              addToCart({

                _id:
                  product._id,

                name:
                  product.name,

                price:
                  product.price,

                selectedVariant: {

                  color:
                    selectedVariant?.color,

                  images:
                    selectedVariant?.images,

                },

                selectedSize,

                quantity: 1,

              });

              alert(
                "Added to cart 🔥"
              );

            }}

            className={`mt-14 w-full py-5 rounded-2xl text-2xl font-black transition

            ${
              getSizeStock(
                selectedSize
              ) <= 0

                ? "bg-gray-400 text-white cursor-not-allowed"

                : "bg-gradient-to-r from-blue-600 to-green-500 text-white hover:scale-[1.02]"
            }`}
          >

            {
              !selectedSize

                ? "Select Size"

                : getSizeStock(
                    selectedSize
                  ) <= 0

                ? "Out Of Stock"

                : "Add To Cart"
            }

          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;