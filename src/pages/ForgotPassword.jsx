import { useState }
from "react";

import API
from "../services/api";

import { useNavigate }
from "react-router-dom";

function ForgotPassword() {

  const navigate =
    useNavigate();

  const [formData,
    setFormData] =
    useState({
      email: "",
      otp: "",
      newPassword: "",
    });

  const [otpSent,
    setOtpSent] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });
    };

  // SEND OTP

  const handleSendOTP =
    async () => {

      try {

        setLoading(true);

        await API.post(
          "/auth/send-otp",
          {
            email:
              formData.email,
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

  // RESET PASSWORD

  const handleResetPassword =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        await API.post(
          "/auth/reset-password",
          formData
        );

        alert(
          "Password reset successful ✅"
        );

        navigate("/login");

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||
            "Something went wrong"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-green-50 px-6">

      <form
        onSubmit={
          handleResetPassword
        }
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >

        <h1 className="text-4xl font-black text-center mb-10 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">

          Forgot Password

        </h1>

        <div className="space-y-6">

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-xl"
          />

          {!otpSent && (

            <button
              type="button"
              onClick={
                handleSendOTP
              }
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
            >

              {loading
                ? "Sending..."
                : "Send OTP"}

            </button>

          )}

          {otpSent && (

            <>

              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                onChange={
                  handleChange
                }
                className="w-full border p-4 rounded-xl"
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                onChange={
                  handleChange
                }
                className="w-full border p-4 rounded-xl"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-4 rounded-xl font-bold"
              >

                {loading
                  ? "Resetting..."
                  : "Reset Password"}

              </button>

            </>

          )}

        </div>

      </form>

    </div>
  );
}

export default ForgotPassword;