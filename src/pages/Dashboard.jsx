import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  // Fetch tasks from backend
  const fetchTasks = async (pageParam = 1) => {
    setLoading(true);
    try {
      const limit = 5;
      const response = await fetch(
        `${BASE_URL}/usertask/tasks?page=${pageParam}&limit=${limit}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      console.log("taskData", data);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/usertask/tasks`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      setNewTask({ title: "", description: "" });
      fetchTasks(page); // refresh the task list
    } catch (err) {
      setError(err.message);
    }
  };

  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/usertask/tasks/${taskId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  // DELETE task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${BASE_URL}/usertask/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      // Re-fetch tasks after delete
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  //   logout
  const handleLogout = async () => {
    try {
      // Send POST request to clear the cookie
      const response = await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      // Optionally redirect to login page
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  // Simple pagination controls
  const handlePreviousPage = () => {
    if (page > 1) {
      fetchTasks(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchTasks(page + 1);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">Task Dashboard</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Loader or Task Table */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-muted">No tasks found for the current user.</p>
      ) : (
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "20%" }}>Title</th>
              <th style={{ width: "35%" }}>Description</th>
              <th style={{ width: "15%" }}>Status</th>
              <th style={{ width: "20%" }}>Actions</th>
              <th style={{ width: "10%" }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>
                  <select
                    className="form-select"
                    style={{ maxWidth: "150px" }}
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteTask(task._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          onClick={handlePreviousPage}
          className="btn btn-outline-primary"
          disabled={page <= 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className="btn btn-outline-primary"
          disabled={page >= totalPages}>
          Next
        </button>
      </div>

      {/* Create New Task */}
      <hr className="my-5" />
      <h2 className="mb-3">Create New Task</h2>
      <form onSubmit={handleCreateTask} className="mb-5">
        <div className="mb-3">
          <label htmlFor="taskTitle" className="form-label fw-semibold">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="taskTitle"
            placeholder="Enter task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="taskDesc" className="form-label fw-semibold">
            Description
          </label>
          <textarea
            className="form-control"
            id="taskDesc"
            rows="3"
            placeholder="Enter task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Task
        </button>
      </form>
    </div>
  );
}
