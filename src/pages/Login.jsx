import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

import { useAuth } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [showPassword, setShowPassword] =
  useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      login(res.data);

      navigate("/");

    } catch (error) {

      alert(
        error.response.data.message
      );

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-green-50 px-6">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >

        <h1 className="text-4xl font-black text-center mb-10 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">

          Welcome Back

        </h1>

        <div className="space-y-6">

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-4 rounded-xl"
          />

          <div className="relative">

  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    name="password"
    placeholder="Password"
    onChange={handleChange}
    className="w-full border p-4 rounded-xl pr-14"
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(
        !showPassword
      )
    }
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >

    {showPassword ? (
      <EyeOff size={22} />
    ) : (
      <Eye size={22} />
    )}

  </button>

</div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-4 rounded-xl text-lg font-bold hover:scale-[1.02] transition"
          >

            Login

          </button>

          <p className="text-center mt-6">

  <span
    onClick={() =>
      navigate(
        "/forgot-password"
      )
    }
    className="text-blue-600 font-semibold cursor-pointer hover:underline"
  >

    Forgot Password?

  </span>

</p>

        </div>

      </form>

    </div>
  );
}

export default Login;