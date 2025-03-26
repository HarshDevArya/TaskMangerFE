import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container">
      <h1>Please Assign the task Here</h1>
      <div className="d-flex gap-5">
        <Link className="btn btn-success" to="/login">
          Log in
        </Link>
        <Link className="btn btn-warning" to="/signin">
          Sign in
        </Link>
      </div>
    </div>
  );
}
