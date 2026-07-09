import { useCart }
from "../context/CartContext";

import { useNavigate }
from "react-router-dom";

function CartDrawer() {

  const navigate =
    useNavigate();

  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    increaseQty,
    decreaseQty,
    removeFromCart,
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

    <>

      {/* OVERLAY */}

      {isCartOpen && (

        <div
          onClick={() =>
            setIsCartOpen(false)
          }
          className="fixed inset-0 bg-black/40 z-40"
        />

      )}

      {/* DRAWER */}

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-50 shadow-2xl transition-transform duration-300 overflow-y-auto ${
          isCartOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        <div className="p-8">

          {/* HEADER */}

          <div className="flex items-center justify-between">

            <h2 className="text-3xl font-black">

              Your Cart

            </h2>

            <button
              onClick={() =>
                setIsCartOpen(false)
              }
              className="text-2xl"
            >

              ✕

            </button>

          </div>

          {/* EMPTY */}

          {cartItems.length === 0 ? (

            <p className="mt-10 text-gray-500">

              Your cart is empty

            </p>

          ) : (

            <>

              {/* ITEMS */}

              <div className="mt-10 space-y-8">

                {cartItems.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={index}
                      className="flex gap-8 border-b pb-8 items-start"
                    >

                      {/* IMAGE */}

                      <img
                        src={
                          item
                            ?.selectedVariant
                            ?.images?.[0] ||
                          "https://via.placeholder.com/300"
                        }
                        alt={item.name}
                        className="w-40 h-40 object-cover rounded-2xl bg-gray-100 p-2"
                      />

                      {/* DETAILS */}

                      <div className="flex-1">

                        <h3 className="font-bold text-lg">

                          {item.name}

                        </h3>

                        <p className="text-gray-500 mt-1">

                          {
                            item
                              ?.selectedVariant
                              ?.color ||
                            "Variant"
                          }

                        </p>

                        <p className="text-gray-500">

                          Size: {
                            item.selectedSize
                          }

                        </p>

                        <p className="font-bold text-green-600 mt-2">

                          ₹{item.price}

                        </p>

                        {/* QTY */}

                        <div className="flex items-center gap-3 mt-4">

                          <button
                            onClick={() =>
                              decreaseQty(
                                index
                              )
                            }
                            className="w-8 h-8 border rounded-full"
                          >

                            -

                          </button>

                          <span>

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
                            className="w-8 h-8 border rounded-full"
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
                          className="text-red-500 mt-4"
                        >

                          Remove

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* TOTAL */}

              <div className="mt-10 border-t pt-6">

                <div className="flex items-center justify-between text-2xl font-black">

                  <span>
                    Total
                  </span>

                  <span>
                    ₹{total}
                  </span>

                </div>

                <button
                  onClick={() => {

                    setIsCartOpen(
                      false
                    );

                    navigate(
                      "/checkout"
                    );

                  }}
                  className="mt-8 w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-4 rounded-full text-lg font-bold hover:scale-[1.02] transition"
                >

                  Reserve My Tee

                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </>

  );
}

export default CartDrawer;