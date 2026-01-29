import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ExpenseForm from "../components/ExpenseForm";
import Sidebar from "../components/Sidebar";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#38bdf8", "#22c55e", "#facc15", "#fb923c", "#a855f7"];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // SAFE MODE DEFAULT
  const mode =
    new URLSearchParams(location.search).get("mode") || "view";

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);

  // Profile
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // ======================
  // FETCH
  // ======================
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch {
      console.error("Error fetching expenses");
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch {
      alert("Error deleting expense");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ======================
  // TOTALS & CHART
  // ======================
  const totalAmount = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const pieData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses]);

  // ======================
  // PROFILE ACTIONS
  // ======================
  const handleChangeName = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.put("/user/change-name", { name });
      setMessage(res.data.message);
      setName("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating name");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.put("/user/change-password", {
        oldPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error updating password"
      );
    }
  };

  // ======================
  // EDIT HANDLER (KEY FIX)
  // ======================
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    navigate("/dashboard?mode=add");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content page-enter">
        <h2>Dashboard</h2>
        {message && <p>{message}</p>}

        {/* ======================
            VIEW EXPENSES
        ====================== */}
        {mode === "view" && (
          <>
            <h3>Total Expense: {totalAmount}</h3>

            {pieData.length > 0 && (
<div className="chart-card">
  <ResponsiveContainer width="100%" height={260}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={75}
        innerRadius={40}
        stroke="#fff"
        strokeWidth={2}
      >
        {pieData.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>


            )}

            {loading ? (
              <p>Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p>No expenses added yet</p>
            ) : (
              <ul className="expense-grid">
                {expenses.map((exp) => (
                  <li className="expense-card" key={exp._id}>
                    <strong>{exp.title}</strong>
                    <span>
                      {exp.amount} — {exp.category}
                    </span>

                    <div>
                      <button onClick={() => handleEdit(exp)}>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteExpense(exp._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* ======================
            ADD / EDIT EXPENSE
        ====================== */}
        {mode === "add" && (
          <ExpenseForm
            onAdd={() => {
              fetchExpenses();
              navigate("/dashboard");
            }}
            editingExpense={editingExpense}
            clearEdit={() => setEditingExpense(null)}
          />
        )}

        {/* ======================
            CHANGE NAME
        ====================== */}
        {mode === "change-name" && (
          <form className="expense-form" onSubmit={handleChangeName}>
            <h3>Change Name</h3>
            <input
              placeholder="New Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button type="submit">Update Name</button>
          </form>
        )}

        {/* ======================
            CHANGE PASSWORD
        ====================== */}
        {mode === "change-password" && (
          <form
            className="expense-form"
            onSubmit={handleChangePassword}
          >
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Update Password</button>
          </form>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
