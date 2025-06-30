import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import VerifyOtpPage from "./pages/VerifyOtpPage"; // 👈 Add this import

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} /> {/* 👈 Add this route */}
    </Routes>
  );
}

export default App;
