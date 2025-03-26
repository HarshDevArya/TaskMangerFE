import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container my-5">
      {/* Main heading */}
      <header className="mb-4 text-center">
        <h1 className="display-5">Welcome to TaskManager</h1>
        <p className="text-muted">
          Your tasks, organized and trackable in one place.
        </p>
      </header>

      {/* Content section */}
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-8">
          <div className="card shadow-sm">
            <div className="card-body text-center p-4">
              <h2 className="h4 mb-3">Ready to begin?</h2>
              <p className="mb-4">
                Please log in if you already have an account, or sign up if
                you're new here.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link className="btn btn-success px-4" to="/login">
                  Log In
                </Link>
                <Link className="btn btn-warning px-4" to="/signup">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
