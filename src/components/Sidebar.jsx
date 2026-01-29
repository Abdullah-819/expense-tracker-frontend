import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  User,
  Lock,
  LogOut,
} from "lucide-react";

const NavItem = ({ icon: Icon, label, path, active, onClick }) => (
  <li
    className={`sidebar-item ${active ? "active" : ""}`}
    onClick={() => onClick(path)}
  >
    <Icon size={18} />
    <span>{label}</span>
  </li>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
<button
  className={`sidebar-toggle ${open ? "open" : ""}`}
  onClick={() => setOpen((v) => !v)}
  aria-label="Toggle menu"
>
  <span className="burger" />
</button>


      {open && (
        <div
          className="mobile-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <h3 className="sidebar-title">Menu</h3>

        <ul className="sidebar-menu">
          <NavItem
            icon={LayoutDashboard}
            label="View Expenses"
            path="/dashboard?mode=view"
            active={location.search.includes("view")}
            onClick={go}
          />
          <NavItem
            icon={PlusCircle}
            label="Add Expense"
            path="/dashboard?mode=add"
            active={location.search.includes("add")}
            onClick={go}
          />
          <NavItem
            icon={User}
            label="Change Name"
            path="/dashboard?mode=change-name"
            active={location.search.includes("change-name")}
            onClick={go}
          />
          <NavItem
            icon={Lock}
            label="Change Password"
            path="/dashboard?mode=change-password"
            active={location.search.includes("change-password")}
            onClick={go}
          />
        </ul>

        <button className="sidebar-logout" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
