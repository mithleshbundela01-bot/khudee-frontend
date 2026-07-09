import {
  useEffect,
  useState,
} from "react";

import { Link }
from "react-router-dom";

import API
from "../services/api";

function Analytics() {

  const [orders,
    setOrders] =
    useState([]);

  const [products,
    setProducts] =
    useState([]);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const ordersRes =
            await API.get(
              "/orders"
            );

          setOrders(
            ordersRes.data.orders
          );

          const productsRes =
            await API.get(
              "/products"
            );

          setProducts(
            productsRes.data
          );

        } catch (error) {

          console.log(error);

        }
      };

    fetchData();

  }, []);

  // TOTAL ORDERS

  const totalOrders =
    orders.length;

  // PRODUCT ANALYTICS

  const productAnalytics =
    {};

  orders.forEach((order) => {

    order.items.forEach(
      (item) => {

        const productName =
          item.name;

        if (
          !productAnalytics[
            productName
          ]
        ) {

          productAnalytics[
            productName
          ] = {

            totalOrders: 0,

            revenue: 0,

            variants: {},

          };
        }

        productAnalytics[
          productName
        ].totalOrders +=
          item.quantity;

        productAnalytics[
          productName
        ].revenue +=
          item.price *
          item.quantity;

        const variantKey =
          `${item.selectedVariant?.color} | ${item.selectedSize}`;

        if (
          !productAnalytics[
            productName
          ].variants[
            variantKey
          ]
        ) {

          productAnalytics[
            productName
          ].variants[
            variantKey
          ] = 0;
        }

        productAnalytics[
          productName
        ].variants[
          variantKey
        ] +=
          item.quantity;

      }
    );

  });

  // GET STOCK ADDED

  const getVariantStock = (
    productName,
    color,
    size
  ) => {

    const product =
      products.find(
        (p) =>
          p.name ===
          productName
      );

    if (!product)
      return 0;

    const variant =
      product.variants.find(
        (v) =>
          v.color === color
      );

    if (!variant)
      return 0;

    const sizeObj =
      variant.sizes?.find(
        (s) =>
          s.size === size
      );

    if (!sizeObj)
      return 0;

    return (
      sizeObj.stock || 0
    );
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 p-10">

      {/* BACK */}

      <Link
        to="/admin"
        className="inline-block mb-10 text-lg font-semibold hover:text-blue-600"
      >

        ← Back to Dashboard

      </Link>

      {/* TITLE */}

      <div className="flex items-center justify-between flex-wrap gap-6 mb-12">

        <h1 className="text-5xl font-black">

          Analytics Dashboard

        </h1>

        <div className="bg-black text-white px-8 py-5 rounded-3xl">

          <p className="text-lg opacity-70">

            Total Orders

          </p>

          <h2 className="text-5xl font-black mt-2">

            {totalOrders}

          </h2>

        </div>

      </div>

      {/* PRODUCT CARDS */}

      <div className="grid md:grid-cols-2 gap-8">

        {Object.entries(
          productAnalytics
        ).map(
          ([productName,
            data]) => (

            <div
              key={productName}
              className="bg-white rounded-3xl shadow-xl p-8"
            >

              <h2 className="text-3xl font-black">

                {productName}

              </h2>

              <div className="mt-6 space-y-3">

                <p className="text-xl">

                  <span className="font-bold">

                    Total Reserved:

                  </span>{" "}

                  {data.totalOrders}

                </p>

                <p className="text-xl">

                  <span className="font-bold">

                    Revenue Potential:

                  </span>{" "}

                  ₹{data.revenue}

                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedProduct(
                    productName
                  )
                }
                className="mt-8 bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
              >

                View Variant Analytics

              </button>

            </div>

        ))}

      </div>

      {/* VARIANT ANALYTICS */}

      {selectedProduct && (

        <div className="mt-16 bg-white rounded-3xl shadow-xl p-10">

          <div className="flex items-center justify-between mb-10">

            <h2 className="text-4xl font-black">

              {selectedProduct}

              {" "}Variant Analytics

            </h2>

            <button
              onClick={() =>
                setSelectedProduct(
                  null
                )
              }
              className="text-red-500 font-bold text-lg"
            >

              Close

            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b text-left">

                  <th className="py-5 text-xl">

                    Color

                  </th>

                  <th className="py-5 text-xl">

                    Size

                  </th>

                  <th className="py-5 text-xl">

                    Orders

                  </th>

                  <th className="py-5 text-xl">

                    Stock Added

                  </th>

                  <th className="py-5 text-xl">

                    Stock Left

                  </th>

                  <th className="py-5 text-xl">

                    Status

                  </th>

                </tr>

              </thead>

              <tbody>

                {Object.entries(
                  productAnalytics[
                    selectedProduct
                  ].variants
                ).map(
                  ([variant,
                    count]) => {

                    const [
                      color,
                      size,
                    ] =
                      variant.split(
                        " | "
                      );

                    const stock =
                      getVariantStock(
                        selectedProduct,
                        color,
                        size
                      );

                    const stockLeft =
                      stock;

                    return (

                      <tr
                        key={variant}
                        className="border-b"
                      >

                        <td className="py-6 text-lg font-semibold">

                          {color}

                        </td>

                        <td className="py-6 text-lg font-semibold">

                          {size}

                        </td>

                        <td className="py-6 text-lg font-bold text-blue-600">

                          {count}

                        </td>

                        <td className="py-6 text-lg font-bold">

                          {stock}

                        </td>

                        <td className="py-6 text-lg font-bold">

                          {stockLeft}

                        </td>

                        <td className="py-6">

                          <span
  className={`px-5 py-2 rounded-xl font-bold text-white

  ${
    stockLeft === 0

      ? "bg-red-500"

    : stockLeft <= 3

      ? "bg-orange-500"

    : "bg-green-500"
  }`}
>

  {
    stockLeft === 0

      ? "Out Of Stock"

    : stockLeft <= 3

      ? "Low Stock"

    : "In Stock"
  }

</span>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>

  );
}

export default Analytics;