import React, { useState } from "react";

export default function Navbar({ userId, onLogout }) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    // simulate slight delay for user feedback, you can remove setTimeout if logout is synchronous
    setTimeout(() => {
      onLogout(); // clear userId in App
      setLoggingOut(false);
    }, 600);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <a className="navbar-brand fw-bold" href="/t">
        TodoApp
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav me-auto">{/* Future links */}</ul>
        {userId && (
          <button
            onClick={handleLogout}
            className="btn btn-outline-light"
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Logging out...
              </>
            ) : (
              "Logout"
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
