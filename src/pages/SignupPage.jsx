import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { cityAreas, cities } from "../data/areaOptions";
import InputField from "../components/InputField";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
  } = useForm();
  const [passwordValue, setPasswordValue] = useState("");
  const [area, setArea] = useState("");
  const [subArea, setSubArea] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const pwd = data.password;
    const isValidPassword =
      /[A-Z]/.test(pwd) &&
      /\d/.test(pwd) &&
      /[@$!%*?&]/.test(pwd) &&
      pwd.length >= 8;

    if (!isValidPassword) {
      setError("server", {
        type: "manual",
        message: "Password does not meet all requirements",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError("server", {
          type: "manual",
          message: result.message || "Registration failed",
        });
      } else {
        clearErrors("server");
        alert("Signup successful. Redirecting to login...");
        navigate("/");
      }
    } catch (err) {
      setError("server", {
        type: "manual",
        message: "Server error. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-primary">
      <div className="md:w-1/2 flex items-center justify-center bg-white px-10 py-16 shadow-lg rounded-r-3xl">
        <div className="w-full max-w-md space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <h2 className="text-3xl font-bold text-dark">
              Sign Up for NoiseWatch
            </h2>

            {/* Email */}
            <div>
              <InputField
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                onChange={(e) => {
                  setValue("email", e.target.value);
                  clearErrors("server");
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <InputField
                label="Username"
                type="text"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
                onChange={(e) => {
                  setValue("username", e.target.value);
                  clearErrors("server");
                }}
              />
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <InputField
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: true })}
                onChange={(e) => {
                  const value = e.target.value;
                  setPasswordValue(value);
                  setValue("password", value);
                  clearErrors("server");
                }}
              />

              {/* ✅ Password rules with icons */}
              <div className="text-sm mt-1 space-y-1">
                <p className="flex items-center gap-2">
                  {/[A-Z]/.test(passwordValue) ? "✅" : "❌"} At least one uppercase letter
                </p>
                <p className="flex items-center gap-2">
                  {/\d/.test(passwordValue) ? "✅" : "❌"} At least one number
                </p>
                <p className="flex items-center gap-2">
                  {/[@$!%*?&]/.test(passwordValue) ? "✅" : "❌"} At least one special character (@$!%*?&)
                </p>
                <p className="flex items-center gap-2">
                  {passwordValue.length >= 8 ? "✅" : "❌"} At least 8 characters
                </p>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <InputField
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                })}
                onChange={(e) => {
                  setValue("confirmPassword", e.target.value);
                  clearErrors("server");
                }}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-dark mb-1 font-medium">Select City</label>
              <select
                className="w-full border-2 border-dark px-4 py-2 rounded-lg"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setSubArea("");
                  setValue("area", e.target.value);
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
                <label className="block text-dark mb-1 font-medium">Select Sub-Area</label>
                <select
                  className="w-full border-2 border-dark px-4 py-2 rounded-lg"
                  value={subArea}
                  onChange={(e) => {
                    setSubArea(e.target.value);
                    setValue("subArea", e.target.value);
                  }}
                >
                  <option value="">Choose area</option>
                  {cityAreas[area].map((sa) => (
                    <option key={sa}>{sa}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Server Errors */}
            {errors.server && (
              <p className="text-sm text-red-600">{errors.server.message}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-dark text-white py-2 rounded-lg hover:opacity-90"
            >
              Sign Up
            </button>

            {/* Google Login */}
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
                      alert(result.message || "Google Signup failed");
                    } else {
                      localStorage.setItem("user", JSON.stringify(result.user));
                      navigate("/dashboard");
                    }
                  } catch (err) {
                    alert("Google Signup error");
                  }
                }}
                onError={() => {
                  alert("Google Sign Up Failed");
                }}
              />
            </div>

            {/* Login Redirect */}
            <p className="text-sm text-center text-dark">
              Already have an account?{" "}
              <Link to="/" className="underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side Info */}
      <div className="hidden md:flex md:w-1/2 bg-dark text-white items-center justify-center p-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Join NoiseWatch 🚨</h1>
          <p className="text-lg opacity-80">
            Track urban noise and receive instant alerts in your area.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
