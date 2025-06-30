import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { cityAreas, cities } from "../data/areaOptions";
import InputField from "../components/InputField";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [area, setArea] = useState("");
  const [subArea, setSubArea] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });
  
      const result = await res.json();
  
      if (res.status === 404) {
        // user not found
        setError("server", {
          type: "manual",
          message: "You cannot login, you are not registered.",
        });
      } else if (!res.ok) {
        // invalid credentials
        setError("server", {
          type: "manual",
          message: result.message || "Invalid username or password",
        });
      } else {
        clearErrors("server");
  
        // ✅ Call /send-otp with user's email
        const otpRes = await fetch("http://localhost:5000/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: result.email }),
        });
  
        if (!otpRes.ok) {
          const errResult = await otpRes.json();
          setError("server", {
            type: "manual",
            message: errResult.message || "Failed to send OTP.",
          });
          return;
        }
  
        // ✅ OTP sent successfully
        localStorage.setItem("pendingUser", data.username);
        localStorage.setItem("otpEmail", result.email);
        navigate("/verify-otp");
      }
    } catch (err) {
      setError("server", {
        type: "manual",
        message: "Network error. Try again.",
      });
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-dark">
      {/* Left Form */}
      <div className="md:w-1/2 flex items-center justify-center bg-primary px-10 py-16 shadow-lg rounded-r-4xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-5"
        >
          <h2 className="text-3xl font-bold text-dark">Login to NoiseWatch</h2>

          {/* Username Field */}
          <div>
            <InputField
              label="Username"
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <InputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-dark mb-1 font-medium">
              Select City
            </label>
            <select
              className="w-full border-2 border-dark px-4 py-2 rounded-lg"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setSubArea("");
              }}
            >
              <option value="">Choose city</option>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Sub-Area */}
          {area && (
            <div>
              <label className="block text-dark mb-1 font-medium">
                Select Sub-Area
              </label>
              <select
                className="w-full border-2 border-dark px-4 py-2 rounded-lg"
                value={subArea}
                onChange={(e) => setSubArea(e.target.value)}
              >
                <option value="">Choose area</option>
                {cityAreas[area].map((sa) => (
                  <option key={sa}>{sa}</option>
                ))}
              </select>
            </div>
          )}

          {/* Server-side Error */}
          {errors.server && (
            <p className="text-sm text-red-600 mt-1">{errors.server.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-dark text-white py-2 rounded-lg hover:opacity-90"
          >
            Login
          </button>

          {/* Google Login */}
          <div className="flex items-center gap-2 my-2">
            <div className="flex-grow h-px bg-dark" />
            <span className="text-dark text-sm">OR</span>
            <div className="flex-grow h-px bg-dark" />
          </div>

          <div className="mt-4 flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential); 
                  const { email, name } = decoded;

                  try {
                    const res = await fetch("http://localhost:5000/api/auth/google", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email, name }),
                    });

                    const result = await res.json();
                    if (!res.ok) {
                      alert(result.message || "Google Login failed");
                    } else {
                      localStorage.setItem("user", JSON.stringify(result.user));
                      navigate("/dashboard");
                    }
                  } catch (err) {
                    alert("Google Login error");
                  }
                }}
                onError={() => {
                  alert("Google Login Failed"); 
                }}
              />
            </div>

          <p className="text-sm text-center text-dark">
            Don't have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* Right Info */}
      <div className="hidden md:flex md:w-1/2 bg-dark text-white items-center justify-center p-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">NoiseWatch 🚨</h1>
          <p className="text-lg opacity-80">
            Login and stay alert with real-time noise updates
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;