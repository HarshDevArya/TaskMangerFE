// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";
  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/usertask/tasks`, {
        credentials: "include",
      });
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
      fetchTasks(); // refresh the task list
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

  return (
    <div className="container mt-5">
      <h1>Task Dashboard</h1>
      {error && <p className="text-danger">{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found for the current user.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
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
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Create New Task</h2>
      <form onSubmit={handleCreateTask}>
        <div className="mb-3">
          <label htmlFor="taskTitle" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="taskTitle"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="taskDesc" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="taskDesc"
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
