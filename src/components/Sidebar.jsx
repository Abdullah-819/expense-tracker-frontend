import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (path) => {
    navigate(path);
    setOpen(false); // close sidebar on mobile after click
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>
{open && <div className="mobile-overlay" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <h3 className="sidebar-title">Menu</h3>

        <ul className="sidebar-menu">
          <li onClick={() => go("/dashboard?mode=view")}>
            View Expenses
          </li>

          <li onClick={() => go("/dashboard?mode=add")}>
            Add Expense
          </li>

          <li onClick={() => go("/dashboard?mode=change-name")}>
            Change Name
          </li>

          <li onClick={() => go("/dashboard?mode=change-password")}>
            Change Password
          </li>
        </ul>

        <button className="sidebar-logout" onClick={logout}>
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
