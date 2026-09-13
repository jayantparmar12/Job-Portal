import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const validate = () => {
    const errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if(form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.refreshToken, res.data.role, res.data.email);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            id="email" type="text" name="email"
            value={form.email} onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
          {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password" type="password" name="password"
            value={form.password} onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
          {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>}
        </div>

        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        No account? <Link to="/register" className="text-blue-600">Register</Link>
      </p>
    </div>
  );
}