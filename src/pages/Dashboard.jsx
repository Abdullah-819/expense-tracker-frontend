import { Filter } from "lucide-react";
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

const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
const [filterOpen, setFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("day");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [category, setCategory] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses", {
        params: {
          type: filterType,
          year,
          month,
          category,
          min,
          max,
        },
      });
      setExpenses(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filterType, month, year, category, min, max]);

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

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
            <div className="filter-trigger" onClick={() => setFilterOpen(!filterOpen)}>
  <span>{filterType === "day" ? "Today" : filterType}</span>
  <i className="filter-icon"><Filter size={16} />
</i>
</div>

{filterOpen && (
  <div className="filter-dropdown">
    <button onClick={() => { setFilterType("day"); setFilterOpen(false); }}>
      Today
    </button>
    <button onClick={() => { setFilterType("month"); setFilterOpen(false); }}>
      Month
    </button>
    <button onClick={() => { setFilterType("year"); setFilterOpen(false); }}>
      Year
    </button>
  </div>
)}


            {pieData.length > 0 && (
              <div className="chart-card">
                <div className="chart-wrapper">
                  {isMobile ? (
                    <PieChart width={260} height={260}>
                      <defs>
  <linearGradient id="grad-blue" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="#38bdf8" />
    <stop offset="100%" stopColor="#0ea5e9" />
  </linearGradient>
  <linearGradient id="grad-green" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="#22c55e" />
    <stop offset="100%" stopColor="#16a34a" />
  </linearGradient>
  <linearGradient id="grad-yellow" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="#fde047" />
    <stop offset="100%" stopColor="#facc15" />
  </linearGradient>
  <linearGradient id="grad-orange" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="#fb923c" />
    <stop offset="100%" stopColor="#f97316" />
  </linearGradient>
  <linearGradient id="grad-purple" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="#a855f7" />
    <stop offset="100%" stopColor="#9333ea" />
  </linearGradient>
</defs>

                     <Pie
  data={pieData}
  dataKey="value"
  cx="50%"
  cy="50%"
  startAngle={90}
  endAngle={-270}
  innerRadius={82}
  outerRadius={115}
  paddingAngle={4}
  cornerRadius={14}
  isAnimationActive
  animationBegin={200}
  animationDuration={1200}
  animationEasing="ease-out"
>
  {pieData.map((_, i) => (
    <Cell
      key={i}
      fill={`url(#grad-${["blue","green","yellow","orange","purple"][i % 5]})`}
      stroke="rgba(255,255,255,0.35)"
      strokeWidth={1.5}
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
                        Total Expense
                      </text>
                      <Tooltip />
                    </PieChart>
                  ) : (
                    <ResponsiveContainer width="100%">
                      <PieChart>
                         <defs>
  <linearGradient id="grad-blue" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="#38bdf8" />
    <stop offset="100%" stopColor="#0ea5e9" />
  </linearGradient>
  <linearGradient id="grad-green" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="#22c55e" />
    <stop offset="100%" stopColor="#16a34a" />
  </linearGradient>
  <linearGradient id="grad-yellow" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="#fde047" />
    <stop offset="100%" stopColor="#facc15" />
  </linearGradient>
  <linearGradient id="grad-orange" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="#fb923c" />
    <stop offset="100%" stopColor="#f97316" />
  </linearGradient>
  <linearGradient id="grad-purple" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="#a855f7" />
    <stop offset="100%" stopColor="#9333ea" />
  </linearGradient>
</defs>

                       <Pie
  data={pieData}
  dataKey="value"
  cx="50%"
  cy="50%"
  startAngle={90}
  endAngle={-270}
  innerRadius={82}
  outerRadius={115}
  paddingAngle={4}
  cornerRadius={14}
  isAnimationActive
  animationBegin={200}
  animationDuration={1200}
  animationEasing="ease-out"
>
  {pieData.map((_, i) => (
    <Cell
      key={i}
      fill={`url(#grad-${["blue","green","yellow","orange","purple"][i % 5]})`}
      stroke="rgba(255,255,255,0.35)"
      strokeWidth={1.5}
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
                    <small>
                      Added: {formatDateTime(exp.createdAt)}
                    </small>
                    {exp.updatedAt !== exp.createdAt && (
                      <small>
                        Updated: {formatDateTime(exp.updatedAt)}
                      </small>
                    )}
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
