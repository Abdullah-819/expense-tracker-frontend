import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="page-enter">
            <Landing />
          </div>
        }
      />

      <Route
        path="/login"
        element={
          <div className="page-enter">
            <Login />
          </div>
        }
      />

      <Route
        path="/register"
        element={
          <div className="page-enter">
            <Register />
          </div>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="page-enter">
              <Dashboard />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
