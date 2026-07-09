import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

function Orders() {

  const [orders,
    setOrders] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  // FETCH ORDERS

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders =
    async () => {

      try {

        const res =
          await API.get(
            "/orders"
          );

        setOrders(
          res.data.orders
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  // UPDATE STATUS

  const updateStatus =
    async (
      orderId,
      newStatus
    ) => {

      try {

        await API.put(
          `/orders/${orderId}`,
          {
            orderStatus:
              newStatus,
          }
        );

        setOrders((prev) =>

          prev.map((order) =>

            order._id === orderId
              ? {
                  ...order,
                  orderStatus:
                    newStatus,
                }
              : order
          )
        );

      } catch (error) {

        console.log(error);

      }
    };

  // STATUS COLORS

  const getStatusColor =
    (status) => {

      switch (status) {

        case "Reserved":
          return "bg-yellow-100 text-yellow-700";

        case "Confirmed":
          return "bg-blue-100 text-blue-700";

        case "Shipped":
          return "bg-purple-100 text-purple-700";

        case "Delivered":
          return "bg-green-100 text-green-700";

        case "Cancelled":
          return "bg-red-100 text-red-700";

        default:
          return "bg-gray-100 text-gray-700";
      }
    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-3xl font-black">

        Loading Orders...

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-12 flex-wrap gap-6">

          <div>

            <h1 className="text-5xl font-black text-gray-900">

              Orders Dashboard

            </h1>

            <p className="mt-4 text-gray-500 text-lg">

              Manage reserved tees and future orders 🔥

            </p>

          </div>

          <div className="bg-white px-6 py-4 rounded-2xl shadow-lg">

            <span className="text-lg font-bold">

              Total Orders:
              {" "}
              {orders.length}

            </span>

          </div>

        </div>

        {/* NO ORDERS */}

        {orders.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-20 text-center">

            <h2 className="text-4xl font-black">

              No Orders Yet

            </h2>

            <p className="mt-4 text-gray-500 text-lg">

              Reservations will appear here.

            </p>

          </div>

        ) : (

          <div className="space-y-10">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-xl p-8"
              >

                {/* TOP */}

                <div className="flex justify-between items-start gap-6 flex-wrap">

                  {/* CUSTOMER */}

                  <div>

                    <h2 className="text-3xl font-black text-gray-900">

                      {
                        order.customer
                          ?.fullName
                      }

                    </h2>

                    <div className="mt-4 space-y-2 text-gray-600">

                      <p>

                        📧
                        {" "}
                        {
                          order.customer
                            ?.email
                        }

                      </p>

                      <p>

                        📞
                        {" "}
                        {
                          order.customer
                            ?.phone
                        }

                      </p>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div className="flex flex-col items-end gap-4">

                    <div
                      className={`px-5 py-3 rounded-full font-black ${getStatusColor(order.orderStatus)}`}
                    >

                      {
                        order.orderStatus
                      }

                    </div>

                    <select
                      value={
                        order.orderStatus
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="border-2 border-black p-4 rounded-2xl font-bold"
                    >

                      <option>
                        Reserved
                      </option>

                      <option>
                        Confirmed
                      </option>

                      <option>
                        Shipped
                      </option>

                      <option>
                        Delivered
                      </option>

                      <option>
                        Cancelled
                      </option>

                    </select>

                  </div>

                </div>

                {/* ADDRESS */}

                <div className="mt-8 bg-gray-50 rounded-2xl p-6">

                  <h3 className="text-xl font-black mb-4">

                    Shipping Address

                  </h3>

                  <p className="text-gray-700 leading-relaxed">

                    {
                      order
                        .shippingAddress
                        ?.address1
                    }

                    {" "}

                    {
                      order
                        .shippingAddress
                        ?.address2
                    }

                    <br />

                    {
                      order
                        .shippingAddress
                        ?.city
                    }

                    ,
                    {" "}

                    {
                      order
                        .shippingAddress
                        ?.state
                    }

                    {" - "}

                    {
                      order
                        .shippingAddress
                        ?.pincode
                    }

                  </p>

                </div>

                {/* ITEMS */}

                <div className="mt-10">

                  <h3 className="text-2xl font-black mb-6">

                    Reserved Tees

                  </h3>

                  <div className="space-y-6">

                    {order.items.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className="flex items-center justify-between border rounded-2xl p-5 flex-wrap gap-6"
                        >

                          <div className="flex items-center gap-5">

                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              className="w-24 h-24 object-cover rounded-2xl"
                            />

                            <div>

                              <h4 className="text-xl font-black">

                                {
                                  item.name
                                }

                              </h4>

                              <p className="text-gray-500 mt-2">

                                {
                                  item
                                    .selectedVariant
                                    ?.color
                                }

                                {" / "}

                                {
                                  item.selectedSize
                                }

                              </p>

                              <p className="text-gray-500">

                                Qty:
                                {" "}
                                {
                                  item.quantity
                                }

                              </p>

                            </div>

                          </div>

                          <p className="text-2xl font-black">

                            ₹
                            {item.price}

                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* FOOTER */}

                <div className="mt-10 pt-8 border-t flex justify-between items-center flex-wrap gap-4">

                  <div>

                    <p className="text-gray-500">

                      Reserved On

                    </p>

                    <h3 className="text-xl font-black">

                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}

                    </h3>

                  </div>

                  <div className="text-right">

                    <p className="text-gray-500">

                      Total Amount

                    </p>

                    <h3 className="text-4xl font-black">

                      ₹
                      {
                        order.totalAmount
                      }

                    </h3>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Orders;