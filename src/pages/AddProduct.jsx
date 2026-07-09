import axios from "axios";

import {
  useState,
  useEffect,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import API from "../services/api";

function AddProduct() {

  const { id } =
    useParams();

  const [loading,
    setLoading] =
    useState(false);

  const [products,
    setProducts] =
    useState([]);

  const [formData,
    setFormData] =
    useState({

      name: "",

      description: "",

      price: "",

      category: "",

      status: "Live",

      featured: false,

      variants: [

        {

          color: "",

          images: [""],

          sizes: [

            {

              size: "",

              stock: 0,

              addStock: "",

              removeStock: "",

            },

          ],

        },

      ],

    });

  // FETCH PRODUCT

  useEffect(() => {

    if (!id) return;

    const fetchProduct =
      async () => {

        try {

          const res =
            await API.get(
              `/products/${id}`
            );

          const product =
            res.data;

          setFormData({

            name:
              product.name || "",

            description:
              product.description || "",

            price:
              product.price || "",

            category:
              product.category || "",

            status:
              product.status || "Live",

            featured:
              product.featured || false,

            variants:
              product.variants?.length
                ? product.variants.map(
                    (variant) => ({

                      ...variant,

                      sizes:
                        variant.sizes.map(
                          (sizeItem) => ({

                            ...sizeItem,

                            addStock: "",

                            removeStock: "",

                          })
                        ),

                    })
                  )
                : [

                    {

                      color: "",

                      images: [""],

                      sizes: [

                        {

                          size: "",

                          stock: 0,

                          addStock: "",

                          removeStock: "",

                        },

                      ],

                    },

                  ],

          });

        } catch (error) {

          console.log(error);

        }
      };

    fetchProduct();

  }, [id]);

  // NORMAL INPUTS

  const handleChange =
    (e) => {

      const {
        name,
        value,
        type,
        checked,
      } = e.target;

      setFormData({

        ...formData,

        [name]:
          type === "checkbox"
            ? checked
            : value,

      });
    };

  // VARIANT CHANGE

  const handleVariantChange =
    (
      variantIndex,
      field,
      value
    ) => {

      const updatedVariants =
        [...formData.variants];

      updatedVariants[
        variantIndex
      ][field] = value;

      setFormData({

        ...formData,

        variants:
          updatedVariants,

      });
    };

  // IMAGE CHANGE

  const handleImageChange =
    (
      variantIndex,
      imageIndex,
      value
    ) => {

      const updatedVariants =
        [...formData.variants];

      updatedVariants[
        variantIndex
      ].images[
        imageIndex
      ] = value;

      setFormData({

        ...formData,

        variants:
          updatedVariants,

      });
    };

  // ADD VARIANT

  const addVariant = () => {

    setFormData((prev) => ({

      ...prev,

      variants: [

        ...prev.variants,

        {

          color: "",

          images: [""],

          sizes: [

            {

              size: "",

              stock: 0,

              addStock: "",

              removeStock: "",

            },

          ],

        },

      ],

    }));
  };

  // REMOVE VARIANT

  const removeVariant =
    (variantIndex) => {

      const updatedVariants =
        [...formData.variants];

      updatedVariants.splice(
        variantIndex,
        1
      );

      setFormData({

        ...formData,

        variants:
          updatedVariants,

      });
    };

  // ADD IMAGE FIELD

  const addImageField =
    (variantIndex) => {

      const updatedVariants =
        [...formData.variants];

      updatedVariants[
        variantIndex
      ].images.push("");

      setFormData({

        ...formData,

        variants:
          updatedVariants,

      });
    };

  // REMOVE IMAGE FIELD

  const removeImageField =
    (
      variantIndex,
      imageIndex
    ) => {

      const updatedVariants =
        [...formData.variants];

      updatedVariants[
        variantIndex
      ].images.splice(
        imageIndex,
        1
      );

      setFormData({

        ...formData,

        variants:
          updatedVariants,

      });
    };

  // ADD SIZE

  const addSize =
    (variantIndex) => {

      const updatedVariants =
        [...formData.variants];

      updatedVariants[
        variantIndex
      ].sizes.push({

        size: "",

        stock: 0,

        addStock: "",

        removeStock: "",

      });

      setFormData({

        ...formData,

        variants:
          updatedVariants,

      });
    };

  // CLOUDINARY UPLOAD

  const uploadImage =
    async (file) => {

      const data =
        new FormData();

      data.append(
        "file",
        file
      );

      data.append(
        "upload_preset",
        import.meta.env
          .VITE_CLOUDINARY_UPLOAD_PRESET
      );

      try {

        const res =
          await axios.post(
            `https://api.cloudinary.com/v1_1/${
              import.meta.env
                .VITE_CLOUDINARY_CLOUD_NAME
            }/image/upload`,
            data
          );

        return res.data.secure_url;

      } catch (error) {

        console.log(error);

        return null;

      }
    };

  // SUBMIT

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const productData = {

          name:
            formData.name,

          description:
            formData.description,

          price:
            Number(
              formData.price
            ),

          category:
            formData.category,

          status:
            formData.status,

          featured:
            formData.featured,

          variants:
            formData.variants.map(
              (variant) => ({

                color:
                  variant.color,

                images:
                  variant.images.filter(
                    Boolean
                  ),

                sizes:
                  variant.sizes.map(
                    (sizeItem) => {

                      const currentStock =
                        Number(
                          sizeItem.stock || 0
                        );

                      const addStock =
                        Number(
                          sizeItem.addStock || 0
                        );

                      const removeStock =
                        Number(
                          sizeItem.removeStock || 0
                        );

                      return {

                        size:
                          sizeItem.size,

                        stock:
                          Math.max(
                            currentStock +
                            addStock -
                            removeStock,
                            0
                          ),

                      };

                    }
                  ),

              })
            ),

        };

        if (id) {

          await API.put(
            `/products/${id}`,
            productData
          );

        } else {

          await API.post(
            "/products",
            productData
          );
        }

        alert(
          id
            ? "Product updated successfully 🔥"
            : "Product added successfully 🔥"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to save product"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 p-10">

      <div className="max-w-6xl mx-auto bg-white p-10 rounded-3xl shadow-2xl">

        <Link
          to="/admin"
          className="inline-block mb-8 text-lg font-semibold hover:text-blue-600"
        >

          ← Back to Dashboard

        </Link>

        <h1 className="text-5xl font-black mb-10">

          {id
            ? "Edit Product"
            : "Add Product"}

        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-8"
        >

          <input
            required
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
          />

          <textarea
            required
            name="description"
            placeholder="Description"
            rows="5"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
          />

          <input
            required
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
          />

          <input
            required
            type="text"
            name="category"
            placeholder="Category"
            value={
              formData.category
            }
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
          />

          {/* VARIANTS */}

          <div className="space-y-10">

            {formData.variants.map(
              (
                variant,
                variantIndex
              ) => (

                <div
                  key={
                    variantIndex
                  }
                  className="border-2 p-6 rounded-3xl"
                >

                  <div className="flex items-center justify-between mb-6">

                    <h2 className="text-2xl font-black">

                      Variant {
                        variantIndex + 1
                      }

                    </h2>

                    <button
                      type="button"
                      onClick={() =>
                        removeVariant(
                          variantIndex
                        )
                      }
                      className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold"
                    >

                      Delete Variant

                    </button>

                  </div>

                  {/* COLOR */}

                  <input
                    required
                    type="text"
                    placeholder="Color"
                    value={
                      variant.color
                    }
                    onChange={(e) =>
                      handleVariantChange(
                        variantIndex,
                        "color",
                        e.target.value
                      )
                    }
                    className="w-full border p-4 rounded-xl mb-6"
                  />

                  {/* SIZE STOCK */}

                  <div className="space-y-6 mb-6">

                    {variant.sizes.map(
                      (
                        sizeItem,
                        sizeIndex
                      ) => (

                        <div
                          key={sizeIndex}
                          className="grid md:grid-cols-4 gap-4"
                        >

                          {/* SIZE */}

                          <input
                            type="text"
                            placeholder="Size"
                            value={
                              sizeItem?.size || ""
                            }
                            onChange={(e) => {

                              const updatedVariants =
                                [...formData.variants];

                              updatedVariants[
                                variantIndex
                              ].sizes[
                                sizeIndex
                              ].size =
                                e.target.value;

                              setFormData({

                                ...formData,

                                variants:
                                  updatedVariants,

                              });

                            }}
                            className="border p-4 rounded-xl"
                          />

                          {/* CURRENT STOCK */}

                          <input
                            type="number"
                            placeholder="Current Stock"
                            value={
                              sizeItem?.stock || 0
                            }
                            readOnly
                            className="border p-4 rounded-xl bg-gray-100"
                          />

                          {/* ADD STOCK */}

                          <input
                            type="number"
                            placeholder="Add More"
                            value={
                              sizeItem?.addStock || ""
                            }
                            onChange={(e) => {

                              const updatedVariants =
                                [...formData.variants];

                              updatedVariants[
                                variantIndex
                              ].sizes[
                                sizeIndex
                              ].addStock =
                                e.target.value;

                              setFormData({

                                ...formData,

                                variants:
                                  updatedVariants,

                              });

                            }}
                            className="border p-4 rounded-xl"
                          />

                          {/* REMOVE STOCK */}

                          <input
                            type="number"
                            placeholder="Remove"
                            value={
                              sizeItem?.removeStock || ""
                            }
                            onChange={(e) => {

                              const updatedVariants =
                                [...formData.variants];

                              updatedVariants[
                                variantIndex
                              ].sizes[
                                sizeIndex
                              ].removeStock =
                                e.target.value;

                              setFormData({

                                ...formData,

                                variants:
                                  updatedVariants,

                              });

                            }}
                            className="border p-4 rounded-xl"
                          />

                        </div>

                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        addSize(
                          variantIndex
                        )
                      }
                      className="bg-black text-white px-5 py-2 rounded-xl font-bold"
                    >

                      + Add Size

                    </button>

                  </div>

                  {/* IMAGES */}

                  <div className="grid md:grid-cols-2 gap-4">

                    {variant.images.map(
                      (
                        image,
                        imageIndex
                      ) => (

                        <div
                          key={imageIndex}
                          className="border rounded-2xl p-4 bg-gray-50"
                        >

                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {

                              const file =
                                e.target.files[0];

                              if (!file) return;

                              const uploadedUrl =
                                await uploadImage(
                                  file
                                );

                              if (uploadedUrl) {

                                handleImageChange(
                                  variantIndex,
                                  imageIndex,
                                  uploadedUrl
                                );
                              }

                            }}
                            className="w-full border p-3 rounded-xl bg-white"
                          />

                          {image && (

                            <img
                              src={image}
                              alt="Preview"
                              className="mt-4 w-40 h-40 object-cover rounded-2xl border shadow-md"
                            />

                          )}

                          <button
                            type="button"
                            onClick={() =>
                              removeImageField(
                                variantIndex,
                                imageIndex
                              )
                            }
                            className="mt-4 text-red-500 font-semibold"
                          >

                            Remove Image

                          </button>

                        </div>

                      )
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addImageField(
                        variantIndex
                      )
                    }
                    className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
                  >

                    + Add More Images

                  </button>

                </div>

              )
            )}

            <button
              type="button"
              onClick={addVariant}
              className="bg-black text-white px-8 py-4 rounded-2xl font-bold"
            >

              + Add Variant

            </button>

          </div>

          {/* STATUS */}

          <select
            name="status"
            value={formData.status}
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
          >

            <option>
              Live
            </option>

            <option>
              Draft
            </option>

            <option>
              Sold Out
            </option>

          </select>

          {/* FEATURED */}

          <label className="flex items-center gap-3 font-semibold">

            <input
              type="checkbox"
              name="featured"
              checked={
                formData.featured
              }
              onChange={
                handleChange
              }
            />

            Featured Product

          </label>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-5 rounded-2xl text-xl font-bold"
          >

            {loading
              ? "Saving..."
              : id
              ? "Update Product"
              : "Add Product"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;