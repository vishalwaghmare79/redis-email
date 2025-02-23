import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiTrash } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const ViewMail = () => {
  const { id } = useParams();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/email/${id}`
        const { data } = await axios.get(apiUrl);
        setEmail(data.email);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching email:", error);
        setLoading(false);
      }
    };

    fetchEmail();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!email) {
    return <p className="text-center text-red-500">Email not found!</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <Link to="/dashboard/allemails" className="text-blue-600 flex items-center gap-2 hover:underline">
          <FiArrowLeft className="text-lg" /> Back to all emails
        </Link>
        <button className="text-red-500 hover:text-red-600">
          <FiTrash className="text-lg" />
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{email.subject}</h2>
      <p className="text-gray-500 text-sm mb-4">Sent on {new Date(email.createdAt).toLocaleString()}</p>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-gray-700">
          <span className="font-semibold">From:</span> {`You ${user.email}`}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">To:</span> {email.email} ({email.name})
        </p>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
        <p className="text-gray-800 leading-relaxed">{email.content}</p>
      </div>
    </div>
  );
};

export default ViewMail;
