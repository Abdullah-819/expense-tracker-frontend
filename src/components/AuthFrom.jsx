import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import api from "../api/axios";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const isRegister = type === "register";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isRegister) {
        await api.post("/auth/register", form);
        setMessage("Registration successful. Now you can login.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? <HashLoader size={20} color="#fff" /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
