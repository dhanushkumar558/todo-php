import { useState } from "react";

export default function Signup({ setUserId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://boltxgaming.com/todo/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setSuccess("Signup successful!");
        setUserId(data.user_id);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
        <div className="card shadow-sm p-4 mb-4" style={{ maxWidth: "500px", margin: "auto" }}>
          <h3 className="mb-3 text-primary">Sign Up</h3>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          {success && (
            <div className="alert alert-success mt-3 mb-0 py-2 px-3" role="alert">
              {success}
            </div>
          )}
          {error && (
            <div className="alert alert-danger mt-3 mb-0 py-2 px-3" role="alert">
              {error}
            </div>
          )}

          <div className="text-center mt-3">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
