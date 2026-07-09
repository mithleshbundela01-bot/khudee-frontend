import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

import { useAuth } from "../context/AuthContext";

function Register() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
  useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

    const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [otp, setOtp] =
  useState("");

const [otpSent, setOtpSent] =
  useState(false);

const [verified, setVerified] =
  useState(false);

const [loading, setLoading] =
  useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSendOTP =
  async () => {

    if (!formData.email) {

  return alert(
    "Please enter email first"
  );
}

    try {

      setLoading(true);

      await API.post(
        "/auth/send-otp",
        {
          email: formData.email,
        }
      );

      alert(
        "OTP sent successfully 📩"
      );

      setOtpSent(true);

    } catch (error) {

      alert(
        error.response?.data
          ?.message ||
          "Failed to send OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  const handleVerifyOTP =
  async () => {

    try {

      setLoading(true);

      const res =
        await API.post(
          "/auth/verify-otp",
          {
            email:
              formData.email,

            otp,
          }
        );

      if (res.data.verified) {

        setVerified(true);

        alert(
          "Email verified successfully ✅"
        );
      }

    } catch (error) {

      alert(
        error.response?.data
          ?.message ||
          "Invalid OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!verified) {

  return alert(
    "Please verify your email first"
  );
}

    try {
      if (
  formData.password !==
  formData.confirmPassword
) {

  return alert(
    "Passwords do not match"
  );

}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (
  !passwordRegex.test(
    formData.password
  )
) {

  return alert(
    "Password must contain:\n• 8+ characters\n• Uppercase\n• Lowercase\n• Number\n• Special character"
  );

}
      const res = await API.post(
        "/auth/register",
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

          Create Account

        </h1>

        <div className="space-y-6">

          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full border p-4 rounded-xl"
          />

          <input
            type="email"
            disabled={verified}
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-4 rounded-xl"
          />

          {/* SEND OTP */}

{!otpSent && (

  <button
    type="button"
    onClick={handleSendOTP}
    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
  >

    {loading
      ? "Sending..."
      : "Send OTP"}

  </button>

)}

{/* OTP SECTION */}

{otpSent && !verified && (

  <div className="space-y-4">

    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) =>
        setOtp(
          e.target.value
        )
      }
      className="w-full border p-4 rounded-xl"
    />

    <button
      type="button"
      onClick={handleVerifyOTP}
      className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
    >

      {loading
        ? "Verifying..."
        : "Verify OTP"}

    </button>

  </div>

)}

{verified && (

  <div className="bg-green-100 text-green-700 p-4 rounded-xl font-semibold text-center">

    Email verified successfully ✅

  </div>

)}

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

          <div className="relative">

  <input
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    name="confirmPassword"
    placeholder="Confirm Password"
    onChange={handleChange}
    className="w-full border p-4 rounded-xl pr-14"
  />

  <button
    type="button"
    onClick={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >

    {showConfirmPassword ? (
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

            Register

          </button>

        </div>

      </form>

    </div>
  );
}

export default Register;