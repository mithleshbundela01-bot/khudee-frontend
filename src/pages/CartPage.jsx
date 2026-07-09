import { useCart } from "../context/CartContext";

import {
  Link,
  useNavigate,
} from "react-router-dom";

function CartPage() {

  const navigate =
    useNavigate();

  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const total =
    cartItems.reduce(
      (acc, item) =>
        acc +
        item.price *
          item.quantity,
      0
    );

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}

        <div className="flex items-center justify-between flex-wrap gap-6 mb-12">

          <div>

            <h1 className="text-5xl md:text-6xl font-black text-gray-900">

              Your Cart

            </h1>

            <p className="mt-4 text-gray-500 text-lg">

              Your reserved streetwear lineup 🔥

            </p>

          </div>

          <Link to="/">

            <button
              className="px-8 py-4 rounded-full border-2 border-black font-semibold hover:bg-black hover:text-white transition"
            >

              Continue Shopping

            </button>

          </Link>

        </div>

        {/* EMPTY CART */}

        {cartItems.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-20 text-center">

            <h2 className="text-4xl font-black text-gray-900">

              Your cart is empty

            </h2>

            <p className="text-gray-500 mt-5 text-lg">

              Add some fire oversized tees 🔥

            </p>

            <Link to="/">

              <button
                className="mt-10 px-10 py-5 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white text-lg font-bold"
              >

                Explore Collection

              </button>

            </Link>

          </div>

        ) : (

          <div className="grid lg:grid-cols-[1fr_420px] gap-10">

            {/* LEFT SIDE */}

            <div className="bg-white rounded-3xl shadow-xl p-8">

              <div className="space-y-10">

                {cartItems.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex gap-8 border-b pb-10 flex-wrap"
                    >

                      {/* IMAGE */}

                      <div className="w-44 h-44 bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center">

                        <img
                          src={
                            item
                              ?.selectedVariant
                              ?.images?.[0] ||

                            "https://placehold.co/300x300"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />

                      </div>

                      {/* INFO */}

                      <div className="flex-1 min-w-[250px]">

                        <div className="flex items-start justify-between gap-4 flex-wrap">

                          <div>

                            <h2 className="text-3xl font-black text-gray-900">

                              {item.name}

                            </h2>

                            <div className="mt-4 space-y-2 text-lg text-gray-600">

                              <p>

                                <span className="font-bold text-black">

                                  Color:

                                </span>

                                {" "}

                                {
                                  item
                                    ?.selectedVariant
                                    ?.color ||
                                  "Variant"
                                }

                              </p>

                              <p>

                                <span className="font-bold text-black">

                                  Size:

                                </span>

                                {" "}

                                {
                                  item.selectedSize
                                }

                              </p>

                            </div>

                          </div>

                          <p className="text-3xl font-black">

                            ₹
                            {item.price}

                          </p>

                        </div>

                        {/* QUANTITY */}

                        <div className="flex items-center gap-5 mt-8">

                          <button
                            onClick={() =>
                              decreaseQty(
                                index
                              )
                            }
                            className="w-12 h-12 rounded-2xl border text-2xl font-bold hover:bg-black hover:text-white transition"
                          >

                            -

                          </button>

                          <span className="text-2xl font-bold">

                            {
                              item.quantity
                            }

                          </span>

                          <button
                            onClick={() =>
                              increaseQty(
                                index
                              )
                            }
                            className="w-12 h-12 rounded-2xl border text-2xl font-bold hover:bg-black hover:text-white transition"
                          >

                            +

                          </button>

                        </div>

                        {/* REMOVE */}

                        <button
                          onClick={() =>
                            removeFromCart(
                              index
                            )
                          }
                          className="mt-8 text-red-500 font-semibold hover:underline"
                        >

                          Remove Item

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="bg-white rounded-3xl shadow-xl p-8 h-fit sticky top-10">

              <h2 className="text-3xl font-black mb-8">

                Reservation Summary

              </h2>

              {/* SUMMARY */}

              <div className="space-y-5 border-b pb-8">

                <div className="flex justify-between text-lg">

                  <span className="text-gray-600">

                    Total Items

                  </span>

                  <span className="font-bold">

                    {cartItems.length}

                  </span>

                </div>

                <div className="flex justify-between text-lg">

                  <span className="text-gray-600">

                    Reservation Fee

                  </span>

                  <span className="font-bold text-green-600">

                    FREE

                  </span>

                </div>

              </div>

              {/* TOTAL */}

              <div className="flex justify-between items-center pt-8">

                <span className="text-2xl font-black">

                  Total

                </span>

                <span className="text-3xl font-black">

                  ₹{total}

                </span>

              </div>

              {/* MESSAGE */}

              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">

                <p className="text-gray-700 leading-relaxed">

                  Reserve your favorite tees now.

                  No payment is required yet.

                  This helps us understand which drops should launch first 🔥

                </p>

              </div>

              {/* BUTTON */}

              <button
                onClick={() =>
                  navigate(
                    "/checkout"
                  )
                }
                className="w-full mt-10 py-5 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white text-xl font-black hover:scale-[1.02] transition"
              >

                Checkout

              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default CartPage;