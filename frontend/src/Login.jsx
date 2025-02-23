import { useState } from "react";
import { FiLock, FiUser } from "react-icons/fi";
import { useAuth } from "./context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 
import { toast } from "react-toastify";
import Spinner from "./components/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate(); 

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevents default form submission

    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/login`;
      const { data } = await axios.post(apiUrl, { email, password });

      setToken(data.token);
      setUser(data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(data.message || "Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 py-8 px-4">
      <div className="w-full max-w-md bg-gray-50 p-10 text-gray-800 flex flex-col justify-center rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to Bulk Email Sender!
        </h1>
        <p className="text-md text-center font-light mb-6">
          Send bulk emails efficiently using the SendGrid API. Log in to manage and automate your email campaigns with ease.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded-lg text-white font-bold text-md shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Login..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            type="button"
            className="text-blue-600 hover:underline transition duration-200"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
