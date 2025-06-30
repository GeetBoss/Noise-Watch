import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("otpEmail");

  const handleVerify = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Invalid OTP");
      } else {
        localStorage.removeItem("otpEmail");
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Network error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
        <p className="text-sm text-gray-600 mb-2">
          We sent a one-time password to your email.
        </p>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button
          onClick={handleVerify}
          className="w-full bg-dark text-white py-2 rounded-lg hover:opacity-90"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
