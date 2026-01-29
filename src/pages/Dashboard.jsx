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
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#38bdf8", "#22c55e", "#facc15", "#fb923c", "#a855f7"];

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mode =
    new URLSearchParams(location.search).get("mode") || "view";

  const screenWidth = useWindowWidth();
  const isMobile = screenWidth < 768;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);

  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

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

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    navigate("/dashboard?mode=add");
  };

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

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content page-enter">
        <h2>Dashboard</h2>
        {message && <p>{message}</p>}

        {mode === "view" && (
          <>
            <h3>Total Expense</h3>

            {pieData.length > 0 && (
              <div className="chart-card">
                <div className="chart-wrapper">
                  {isMobile ? (
                    <PieChart width={260} height={260}>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        innerRadius={60}
                        isAnimationActive={false}
                      >
                        {pieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[i % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <text
                        x="50%"
                        y="46%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffffff"
                        fontSize="18"
                        fontWeight="700"
                      >
                        Rs {totalAmount}
                      </text>
                      <text
                        x="50%"
                        y="56%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255,255,255,0.6)"
                        fontSize="12"
                      >
                        Total
                      </text>
                      <Tooltip />
                    </PieChart>
                  ) : (
                    <ResponsiveContainer width="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          cx="50%"
                          cy="52%"
                          outerRadius={120}
                          innerRadius={70}
                        >
                          {pieData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={COLORS[i % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <text
                          x="50%"
                          y="48%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#ffffff"
                          fontSize="22"
                          fontWeight="700"
                        >
                          Rs {totalAmount}
                        </text>
                        <text
                          x="50%"
                          y="58%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="rgba(255,255,255,0.6)"
                          fontSize="13"
                        >
                          Total Expense
                        </text>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
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

        {mode === "change-name" && (
          <form
            className="expense-form"
            onSubmit={handleChangeName}
          >
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
