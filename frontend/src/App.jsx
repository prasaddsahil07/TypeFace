/**
 * Main App component with routing and authentication context
 * Sets up all routes and provides global authentication state
 */
import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";
import { Context } from "./main.jsx";
import axios from "axios";

function App() {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  // Fetch user info on mount (cookie-based auth)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/users/info", {
          withCredentials: true,
        });

        setUser(response.data.data); // Assuming backend returns { data: user }
        setIsAuthorized(true);
      } catch (error) {
        setUser(null);
        setIsAuthorized(false);
      }
    };

    fetchUser();
  }, [setIsAuthorized, setUser]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={isAuthorized ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthorized ? <Navigate to="/dashboard" /> : <Register />}
          />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              isAuthorized ? (
                <Layout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="transactions/add" element={<AddTransaction />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
