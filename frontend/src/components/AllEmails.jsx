import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { Link } from "react-router-dom";
import moment from "moment";
import Spinner from "./Spinner";

const AllEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/emails`;
      const { data } = await axios.get(apiUrl);
      setEmails(data.emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async (emailId) => {
    if (window.confirm("Are you sure you want to delete this email?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/email/${emailId}`);
        setEmails(emails.filter((email) => email._id !== emailId));
      } catch (error) {
        console.error("Error deleting email:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        📩 All Emails
      </h2>

      {loading ? (
        <Spinner />
      ) : emails.length === 0 ? (
        <p className="text-gray-500 text-center">No emails found.</p>
      ) : (
        <div className="space-y-3">
          {emails.map((email) => (
            <div
              key={email._id}
              className="p-4 border border-gray-300 rounded-lg bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition"
            >
              <div>
                <Link
                  to={`/dashboard/view/${email._id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {email.subject || "No Subject"}
                </Link>
                <p className="text-gray-700">{email.status}</p>
                <p className="text-sm text-gray-500">
                  {email.email} • {moment(email.createdAt).fromNow()}
                </p>
              </div>
              <button
                className="text-red-500 hover:text-red-700 cursor-pointer"
                onClick={() => deleteEmail(email._id)}
              >
                <FiTrash size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEmails;
