// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/Authcontxr";

export default function LoginPage() {
  const { user, loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL || "";
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        credentials: "include", // Ensures cookies are sent/received
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed!");
      }

      // Optionally, process any returned data
      const data = await response.json();
      console.log("data", data);
      loginUser(data.message);
      // On success, redirect to a protected page (e.g., dashboard)
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-signin w-50 m-auto">
      <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal">Please log in</h1>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <p>
          Doesn't have an account? <Link to="/signup">Signup</Link>
        </p>
        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}
