import { useState, useEffect } from "react";
import { FiInbox, FiSend, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

export const DashboardSidebar = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine the active tab based on the current route
  const getActiveTab = () => {
    if (location.pathname.includes("profile")) return "user";
    if (location.pathname.includes("send")) return "send";
    if (location.pathname.includes("allemails")) return "inbox";
    return "";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when the route changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location]);

  return (
    <>
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform md:relative md:translate-x-0`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Email Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <nav className="p-4 flex-1">
          <Link
            to="/dashboard/profile"
            className={`w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg cursor-pointer ${
              activeTab === "user" ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
            aria-label="User Profile"
          >
            <FiUser /> User Profile
          </Link>
          <Link
            to="/dashboard/send"
            className={`w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg cursor-pointer ${
              activeTab === "send" ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
            aria-label="Send Email"
          >
            <FiSend /> Send Email
          </Link>
          <Link
            to="/dashboard/allemails"
            className={`w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg cursor-pointer mt-2 ${
              activeTab === "inbox" ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
            aria-label="All Emails"
          >
            <FiInbox /> All Emails
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-left rounded-lg cursor-pointer text-red-500"
            aria-label="Logout"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </>
  );
};