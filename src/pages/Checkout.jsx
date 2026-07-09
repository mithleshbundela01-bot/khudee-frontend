import axios from "axios";

import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  State,
  City,
} from "country-state-city";

import API from "../services/api";

import {
  useCart,
} from "../context/CartContext";

import {
  useAuth,
} from "../context/AuthContext";



function Checkout() {

  const { user } =
  useAuth();

  const navigate =
    useNavigate();

  const {
    cartItems,
    clearCart,
  } = useCart();

  const [loading,
    setLoading] =
    useState(false);

  const [savedAddresses,
    setSavedAddresses] =
    useState([]);

  const [saveAddress,
    setSaveAddress] =
    useState(false);

  const [formData,
    setFormData] =
    useState({

      fullName: "",

      email: "",

      phone: "",

      address1: "",

      address2: "",

      state: "",

      stateCode: "",

      city: "",

      pincode: "",

    });

  // LOAD SAVED ADDRESSES

  useEffect(() => {

    const addresses =
      JSON.parse(
        localStorage.getItem(
          "khudeeAddresses"
        )
      ) || [];

    setSavedAddresses(
      addresses
    );

  }, []);

  // STATES + CITIES

  const states =
    State.getStatesOfCountry(
      "IN"
    );

  const cities =
    formData.stateCode
      ? City.getCitiesOfState(
          "IN",
          formData.stateCode
        )
      : [];

  // HANDLE CHANGE

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setFormData({

        ...formData,

        [name]: value,

      });
    };

  // TOTAL

  const total =
    cartItems.reduce(

      (acc, item) =>

        acc +
        item.price *
          item.quantity,

      0
    );

  // PLACE ORDER

  const handlePlaceOrder =
    async () => {

      try {

        setLoading(true);

        // SAVE ADDRESS

        if (saveAddress) {

          const updatedAddresses = [

            ...savedAddresses,

            formData,

          ];

          localStorage.setItem(

            "khudeeAddresses",

            JSON.stringify(
              updatedAddresses
            )

          );
        }

        // CREATE ORDER

        await API.post(
          "/orders",

          {
            user:
  user?.user?._id,

            customer: {

              fullName:
                formData.fullName,

              email:
                formData.email,

              phone:
                formData.phone,

            },

            shippingAddress: {

              address1:
                formData.address1,

              address2:
                formData.address2,

              state:
                formData.state,

              city:
                formData.city,

              pincode:
                formData.pincode,

            },

            items:
              cartItems.map(
                (item) => ({

                  productId:
                    item._id,

                  name:
                    item.name,

                  image:
                    item.selectedVariant
                      ?.images?.[0],

                  price:
                    item.price,

                  quantity:
                    item.quantity,

                  selectedVariant: {

                    color:
                      item.selectedVariant
                        ?.color ||
                      item.selectedVariant,

                  },

                  selectedSize:
                    item.selectedSize ||
                    item.size,

                })
              ),

            totalAmount:
              total,

          }
        );

        clearCart();

        alert(
          "Your tee is reserved 🔥"
        );

        navigate("/reserve-success");

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to reserve tee"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 py-12 px-6">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">

        {/* LEFT */}

        <div className="bg-white p-8 rounded-3xl shadow-xl">

          <h1 className="text-5xl font-black mb-10">

            Shipping Details

          </h1>

          {/* SAVED ADDRESSES */}

          {savedAddresses.length > 0 && (

            <div className="mb-10">

              <h2 className="text-2xl font-black mb-5">

                Saved Addresses

              </h2>

              <div className="grid gap-4">

                {savedAddresses.map(
                  (
                    address,
                    index
                  ) => (

                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setFormData(
                          address
                        )
                      }
                      className="border-2 p-5 rounded-2xl text-left hover:border-blue-500 transition"
                    >

                      <p className="font-bold text-lg">

                        {
                          address.fullName
                        }

                      </p>

                      <p>

                        {
                          address.address1
                        }

                      </p>

                      <p>

                        {
                          address.city
                        }
                        ,{" "}
                        {
                          address.state
                        }

                      </p>

                      <p>

                        {
                          address.phone
                        }

                      </p>

                    </button>

                ))}

              </div>

            </div>

          )}

          <div className="space-y-6">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              className="w-full border p-4 rounded-xl"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              className="w-full border p-4 rounded-xl"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              className="w-full border p-4 rounded-xl"
            />

            <input
              type="text"
              name="address1"
              placeholder="Address Line 1"
              value={
                formData.address1
              }
              onChange={
                handleChange
              }
              className="w-full border p-4 rounded-xl"
            />

            <input
              type="text"
              name="address2"
              placeholder="Address Line 2"
              value={
                formData.address2
              }
              onChange={
                handleChange
              }
              className="w-full border p-4 rounded-xl"
            />

            {/* STATE */}

            <select

              value={
                formData.state
              }

              onChange={(e) => {

                const selectedState =
                  states.find(
                    (state) =>
                      state.name ===
                      e.target.value
                  );

                setFormData({

                  ...formData,

                  state:
                    selectedState.name,

                  stateCode:
                    selectedState.isoCode,

                  city: "",

                });

              }}

              className="w-full border p-4 rounded-xl"
            >

              <option value="">
                Select State
              </option>

              {states.map(
                (state) => (

                  <option
                    key={
                      state.isoCode
                    }
                    value={
                      state.name
                    }
                  >

                    {state.name}

                  </option>

              ))}

            </select>

            {/* CITY */}

            <select

              name="city"

              value={
                formData.city
              }

              onChange={
                handleChange
              }

              className="w-full border p-4 rounded-xl"
            >

              <option value="">
                Select City
              </option>

              {cities.map(
                (city) => (

                  <option
                    key={
                      city.name
                    }
                    value={
                      city.name
                    }
                  >

                    {city.name}

                  </option>

              ))}

            </select>

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={
                formData.pincode
              }
              onChange={
                handleChange
              }
              className="w-full border p-4 rounded-xl"
            />

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-white p-8 rounded-3xl shadow-xl h-fit sticky top-10">

          <h1 className="text-5xl font-black mb-10">

            Order Summary

          </h1>

          <div className="space-y-6">

            {cartItems.map(
              (item, index) => (

                <div
                  key={index}
                  className="flex gap-5 border-b pb-5"
                >

                  <img
                    src={
                      item
                        .selectedVariant
                        ?.images?.[0]
                    }
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-2xl"
                  />

                  <div className="flex-1">

                    <h2 className="text-2xl font-black">

                      {item.name}

                    </h2>

                    <p className="text-gray-500 text-xl">

                      {
                        item
                          .selectedVariant
                          ?.color
                      }
                      {" / "}
                      {
                        item
                          .selectedSize
                      }

                    </p>

                    <p className="text-gray-500 text-xl">

                      Qty:{" "}
                      {item.quantity}

                    </p>

                  </div>

                  <h2 className="text-3xl font-black">

                    ₹
                    {item.price}

                  </h2>

                </div>

            ))}

          </div>

          <div className="border-t mt-8 pt-8 flex justify-between items-center">

            <h2 className="text-4xl font-black">

              Total

            </h2>

            <h2 className="text-4xl font-black">

              ₹{total}

            </h2>

          </div>

          {/* SAVE ADDRESS */}

          <label className="flex items-center gap-3 font-semibold mt-8">

            <input
              type="checkbox"
              checked={
                saveAddress
              }
              onChange={(e) =>
                setSaveAddress(
                  e.target.checked
                )
              }
            />

            Save this address

          </label>

          <button
            onClick={
              handlePlaceOrder
            }
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-green-500 text-white py-5 rounded-2xl text-2xl font-black hover:opacity-90 transition"
          >

            {loading
              ? "Placing Order..."
              : "Place Order"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default Checkout;