
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);

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

      const apiUrl = process.env.REACT_APP_API_URL;

      const formData = new FormData();
      formData.append('recipients', JSON.stringify(recipientList));
      formData.append('subject', subject);
      formData.append('content', content);
      if (file) {
        formData.append('file', file);
      }

      setLoader(true);
      const response = await axios.post(`${apiUrl}/send-emails`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoader(false);

      toast.success(response.data.message);

      // Reset the form fields after successful email send
      setRecipients('');
      setSubject('');
      setContent('');
      setFile(null);
    } catch (error) {
      setLoader(false);
      toast.error('Error sending emails. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Bulk Email Sender</h1>

      <textarea
        className="form-control mb-3"
        placeholder="Recipient List (Format: Name,Email per line)"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
        rows="5"
      />

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        className="form-control mb-3"
        placeholder="Email Content (Use {name} for personalization)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="10"
      />

      <input
        className="form-control mb-3"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="btn btn-success w-100"
        onClick={handleSendEmails}
        disabled={loader}
      >
        {loader ? 'Loading...' : 'Send Emails'}
      </button>


      <ToastContainer />
    </div>
  );
}

export default App;
