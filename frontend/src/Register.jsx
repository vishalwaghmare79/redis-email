import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLock, FiUser, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";
import Spinner from "./components/Spinner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/register`;

      const { data } = await axios.post(apiUrl, {
        name,
        email,
        password,
      });

      toast.success(data.message || "Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 py-8 px-4">
      <div className="w-full max-w-md bg-gray-50 p-10 text-gray-800 flex flex-col justify-center rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Create an Account on Bulk Email Sender!
        </h1>
        <p className="text-md text-center font-light mb-6">
          Register now to manage and automate your bulk email campaigns with ease using the SendGrid API.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.trim())}
              className="w-full px-3 py-2 rounded-lg bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded-lg text-white font-bold text-md shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Register..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            type="button"
            className="text-blue-600 hover:underline transition duration-200"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
