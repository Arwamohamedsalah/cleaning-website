import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import Home from './pages/Home';
import WorkersPage from './pages/Workers';
import Assistants from './pages/Assistants';
import WorkerDetails from './pages/WorkerDetails';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Overview from './pages/Dashboard/Overview';
import Orders from './pages/Dashboard/Orders';
import Customers from './pages/Dashboard/Customers';
import Workers from './pages/Dashboard/Workers';
import DashboardAssistants from './pages/Dashboard/Assistants';
import Applications from './pages/Dashboard/Applications';
import Messages from './pages/Dashboard/Messages';
import Reports from './pages/Dashboard/Reports';
import Profile from './pages/Dashboard/Profile';
import Settings from './pages/Dashboard/Settings';
import Discounts from './pages/Dashboard/Discounts';
import './styles/globals.css';
import './styles/glassmorphism.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  // Set theme to light mode always
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Check if user is authenticated on app load
  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/assistants" element={<Assistants />} />
        <Route path="/worker/:id" element={<WorkerDetails />} />
        {/* ServiceRequest route removed per request */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Overview />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/customers"
          element={
            <PrivateRoute>
              <Customers />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/workers"
          element={
            <PrivateRoute>
              <Workers />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/assistants"
          element={
            <PrivateRoute>
              <DashboardAssistants />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/applications"
          element={
            <PrivateRoute>
              <Applications />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/discounts"
          element={
            <PrivateRoute>
              <Discounts />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

