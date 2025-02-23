import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const SendEmailForm = () => {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleSendEmails = async () => {
    if (!recipients || !subject || !content) {
      toast.error('Please fill in all required fields!');
      return;
    }

    try {
      const recipientList = recipients.split('\n').map((line) => {
        const [name, email] = line.split(',');
        return { name: name.trim(), email: email.trim() };
      });

      const formData = new FormData();
      formData.append('recipients', JSON.stringify(recipientList));
      formData.append('subject', subject);
      formData.append('content', content);
      if (file) {
        formData.append('file', file);
      }

      setLoader(true);
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/send-emails`;
      const response = await axios.post(apiUrl ,formData);
      setLoader(false);

      toast.success(response.data.message);

      setRecipients('');
      setSubject('');
      setContent('');
      setFile(null); //
    } catch (error) {
      setLoader(false);
      console.log(error);
      
      toast.error('Error sending emails. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Bulk Email Sender</h2>
      <textarea
        className="w-full p-2 border border-gray-200 rounded mb-2"
        placeholder="Recipient List (Format: Name,Email per line)"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
        rows={5}
      ></textarea>
      <input
        type="text"
        placeholder="Subject"
        className="w-full p-2 border border-gray-200 rounded mb-2"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Email Content (Use {name} for personalization)"
        className="w-full p-2 border border-gray-200 rounded mb-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
      ></textarea>
      <input
        type="file"
        className="w-full p-2 border border-gray-200 rounded mb-2"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        className="bg-blue-500 text-white w-full p-2 rounded"
        onClick={handleSendEmails}
        disabled={loader}
      >
        {loader ? "Sending..." : "Send Emails"}
      </button>
    </div>
  );
};
