import React from "react";
import { FiEdit, FiKey, FiTrash } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();

  // Placeholder for profile picture (you can replace this with the actual user's profile picture URL)
  const profilePic = user.profilePicture || "https://via.placeholder.com/150";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-8">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">User Profile</h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-40 h-40 mb-4">
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-blue-100"
            />
            <button
              className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
              aria-label="Change Profile Picture"
            >
              <FiEdit className="text-lg" />
            </button>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* User Details Section */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 font-medium">Name:</p>
            <p className="text-gray-900 text-lg">{user.name}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 font-medium">Email:</p>
            <p className="text-gray-900 text-lg">{user.email}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            aria-label="Edit Profile"
          >
            <FiEdit className="text-lg" /> Edit Profile
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
            aria-label="Reset Password"
          >
            <FiKey className="text-lg" /> Reset Password
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            aria-label="Delete Account"
          >
            <FiTrash className="text-lg" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;