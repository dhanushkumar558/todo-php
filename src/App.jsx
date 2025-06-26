import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Todo from "./components/Todo";

// Wrapper for showing Signup/Login toggle on "/" route
function AuthSwitcher({ setUserId }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        {showLogin ? (
          <>
            <Login setUserId={setUserId} />
            <p className="text-center mt-2">
              👋 Don't have an account?{" "}
              <button className="btn btn-link p-0" onClick={() => setShowLogin(false)}>
                Sign up here
              </button>
            </p>
          </>
        ) : (
          <>
            <Signup setUserId={setUserId} />
            <p className="text-center mt-2">
              🔐 Already have an account?{" "}
              <button className="btn btn-link p-0" onClick={() => setShowLogin(true)}>
                Login here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ✅ Route wrapper to protect /todo
function ProtectedRoute({ userId, children }) {
  if (!userId) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

  // Sync with localStorage on login/signup
  const handleSetUserId = (id) => {
    setUserId(id);
    localStorage.setItem("userId", id);
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  return (
    <Router>
      <Navbar userId={userId} onLogout={handleLogout} />
      <div className="container mt-4">
        <Routes>
          {/* Home redirects to /todo or /login */}
          <Route path="/" element={<Navigate to={userId ? "/todo" : "/login"} />} />

          {/* Public routes */}
          {!userId && (
            <>
              <Route path="/login" element={<Login setUserId={handleSetUserId} />} />
              <Route path="/signup" element={<Signup setUserId={handleSetUserId} />} />
              <Route path="/auth" element={<AuthSwitcher setUserId={handleSetUserId} />} />
            </>
          )}

          {/* Private route */}
          <Route
            path="/todo"
            element={
              <ProtectedRoute userId={userId}>
                <Todo userId={userId} />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
