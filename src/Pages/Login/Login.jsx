import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/laundry-logo.png";
import { toast } from "react-toastify";
import axios from "axios";
import { login } from "../../apis/Auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = "localhost:5000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // navigate("/Dashboard");
    const credentials = { email, password };
    try {

     const response = await login(credentials)
     console.log("login-response", response);
     if (response?.status == 200) {
      toast.success(response?.message);
      localStorage.setItem("laundary-token", response?.data?.token);
      localStorage.setItem("user_role", response?.data?.admin?.role_id);
      navigate("/dashboard");
     }
     else if(response?.response?.data?.status == 400){
      toast.error(response?.response?.data?.message);
      return;
     }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl bg-white md:rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Section */}
        <div className="hidden md:flex md:w-1/2 left-section flex-col justify-center items-center p-8 relative">
          <img
            src={logo}
            alt="Admin Illustration"
            className="w-3/4 h-auto object-contain"
          />
         
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 bg-[#F6F6F6] p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* <img
            src={loginImage}
            alt="Admin Illustration"
            className="w-1/2 h-auto mx-auto mb-2"
          /> */}
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">Welcome, Admin</h2>
            <p className="mb-10 text-sm text-center">
              Sign in to access the admin dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter email address"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0a5a85] border border-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password *</label>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0a5a85] border border-gray-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!email || !password || loading}
                className="w-full bg-[#3d9bc7] text-white font-semibold py-2 rounded-lg hover:bg-[#02598e] transition disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="text-center mt-8 text-sm">
              © 2025 Laundary Admin Panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
