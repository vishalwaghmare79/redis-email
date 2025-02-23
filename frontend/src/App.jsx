import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ProtectedLayout from "./ProtectedLayout";
import { ToastContainer } from "react-toastify";
import Register from './Register';
import Dashboard from "./components/Dashboard";
import UserProfile from './components/UserProfile';
import { SendEmailForm } from './components/SendEmailForm';
import AllEmails from './components/AllEmails';
import ViewMail from './components/ViewMail';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedLayout />}>
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<UserProfile />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="send" element={<SendEmailForm />} />
            <Route path="allemails" element={<AllEmails />} />
            <Route path="view/:id" element={<ViewMail />} />
          </Route>
        </Route>

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
