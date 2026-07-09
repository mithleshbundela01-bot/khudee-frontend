import {
  useEffect,
  useState,
} from "react";

import API
from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";

function Profile() {

  const {

  user,

  updateUser,

} = useAuth();

  const [orders,
    setOrders] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [profile,
  setProfile] =
  useState(null);

const [editMode,
  setEditMode] =
  useState(false);

const [profileForm,
  setProfileForm] =
  useState({

    name: "",

    phone: "",

  });

  useEffect(() => {

    const fetchProfile =
  async () => {

    try {

      const res =
        await API.get(

          `/auth/profile/${user.user._id}`

        );

      setProfile(
        res.data.user
      );

      setProfileForm({

        name:
          res.data.user.name,

        phone:
          res.data.user.phone,

      });

    } catch (error) {

      console.log(error);

    }

  };

    const fetchOrders =
      async () => {

        try {

          const res =
            await API.get(

              `/orders/my-orders/${user?.user?._id}`

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

    if (
      user?.user?._id
    ) {

      fetchProfile();

fetchOrders();

    }

  }, [user]);

  const saveProfile = async () => {

  try {

    const res = await API.put(

      `/auth/profile/${user.user._id}`,

      profileForm

    );

    setProfile(
  res.data.user
);

updateUser(
  res.data.user
);

    setEditMode(false);

    alert(
      "Profile updated successfully!"
    );

  } catch (error) {

    console.log(error);

    alert(
      "Failed to update profile."
    );

  }

};

const uploadProfileImage = async (e) => {

  try {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    const uploadRes = await API.post(

      "/upload",

      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }

    );

    const imageUrl = uploadRes.data.url;

    const res = await API.put(

      `/auth/profile/${user.user._id}`,

      {
        ...profileForm,
        profileImage: imageUrl,
      }

    );

    setProfile(
  res.data.user
);

updateUser(
  res.data.user
);

    alert("Profile picture updated!");

  } catch (error) {

    console.log(error);

    alert("Upload failed.");

  }

};

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-4xl font-black">

        Loading...

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 px-6 md:px-20 py-16">
      {profile && (

  <div className="bg-white rounded-3xl shadow-xl p-10 mb-12">

    <div className="flex flex-col md:flex-row items-center gap-8">

     <div className="relative">

  <label htmlFor="profile-upload" className="cursor-pointer">

    <img
      src={
        profile.profileImage ||
        "https://ui-avatars.com/api/?name=" +
          encodeURIComponent(profile.name)
      }
      alt="Profile"
      className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 hover:opacity-80 transition"
    />

  </label>

  <input
    id="profile-upload"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={uploadProfileImage}
  />

</div>

      <div className="flex-1">

        <h2 className="text-4xl font-black">

          {profile.name}

        </h2>

        <p className="text-xl text-gray-600 mt-2">

          {profile.email}

        </p>

        <p className="text-xl text-gray-600 mt-2">

          {profile.phone || "No phone added"}

        </p>

        <p className="text-gray-500 mt-4">

          Member since{" "}

          {new Date(
            profile.createdAt
          ).toLocaleDateString()}

        </p>

      </div>

      <button

        onClick={() =>
          setEditMode(true)
        }

        className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-2xl font-bold"

      >

        Edit Profile

      </button>

    </div>

  </div>

)}
      <h1 className="text-5xl font-black mb-12">

        My Reservations 🔥

      </h1>

      {orders.length === 0 ? (

        <div className="bg-white rounded-3xl p-12 shadow-xl text-center">

          <h2 className="text-3xl font-black">

            No Reservations Yet

          </h2>

        </div>

      ) : (

        <div className="grid gap-8">

          {orders.map(
            (order) => (

              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row gap-8"
              >

                {/* IMAGE */}

                <img
                  src={
                    order.items?.[0]
                      ?.image
                  }
                  alt="tee"
                  className="w-44 h-44 object-cover rounded-2xl"
                />

                {/* INFO */}

                <div className="flex-1">

                  <h2 className="text-3xl font-black">

                    {
                      order.items?.[0]
                        ?.name
                    }

                  </h2>

                  <p className="mt-4 text-xl text-gray-600">

                    Color:
                    {" "}
                    {
                      order.items?.[0]
                        ?.selectedVariant
                        ?.color
                    }

                  </p>

                  <p className="mt-2 text-xl text-gray-600">

                    Size:
                    {" "}
                    {
                      order.items?.[0]
                        ?.selectedSize
                    }

                  </p>

                  <p className="mt-2 text-xl text-gray-600">

                    Qty:
                    {" "}
                    {
                      order.items?.[0]
                        ?.quantity
                    }

                  </p>

                  <p className="mt-2 text-xl text-gray-600">

                    Reserved On:
                    {" "}

                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}

                  </p>

                  <div
  className={`

    mt-6 inline-block px-6 py-3 rounded-full font-black

    ${
      order.orderStatus ===
      "Reserved"

        ? "bg-yellow-100 text-yellow-700"

      : order.orderStatus ===
        "Packed"

        ? "bg-blue-100 text-blue-700"

      : order.orderStatus ===
        "Shipped"

        ? "bg-purple-100 text-purple-700"

      : "bg-green-100 text-green-700"
    }

  `}
>

  {
    order.orderStatus
  }

</div>

                </div>

                {/* PRICE */}

                <div className="text-4xl font-black text-green-600">

                  ₹{
                    order.totalAmount
                  }

                </div>

              </div>

            )
          )}

        </div>

      )}

      {editMode && (

  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-3xl p-8 w-full max-w-md">

      <h2 className="text-3xl font-black mb-8">

        Edit Profile

      </h2>

      <div className="space-y-5">

        <input
          type="text"
          placeholder="Full Name"
          value={profileForm.name}
          onChange={(e) =>
            setProfileForm({
              ...profileForm,
              name: e.target.value,
            })
          }
          className="w-full border rounded-xl p-4"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={profileForm.phone}
          onChange={(e) =>
            setProfileForm({
              ...profileForm,
              phone: e.target.value,
            })
          }
          className="w-full border rounded-xl p-4"
        />

      </div>

      <div className="flex justify-end gap-4 mt-8">

        <button
          onClick={() =>
            setEditMode(false)
          }
          className="px-6 py-3 border rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={saveProfile}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-xl font-bold"
        >
          Save
        </button>

      </div>

    </div>

  </div>

)}

    </div>
  );
}

export default Profile;