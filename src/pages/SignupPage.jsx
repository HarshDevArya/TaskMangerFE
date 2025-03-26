import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
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
      console.log(BASE_URL);
      const response = await fetch(`${BASE_URL}/api/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }

      // You can process returned data if needed
      await response.json();
      // Redirect to login or another page on successful signup
      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-signin w-50 m-auto">
      <form onSubmit={handleSubmit}>
        <h1 className="h3 mb-3 fw-normal">Please Sign Up</h1>

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
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          disabled={loading}>
          {loading ? "Signing Up..." : "Sign up"}
        </button>
      </form>
    </main>
  );
}
