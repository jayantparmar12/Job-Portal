import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function PostJob() {
  const { id } = useParams();       // agar id hai to edit mode
  const isEditMode = Boolean(id);
  const [form, setForm] = useState({
    title: "", description: "", company: "", location: "", salary: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      api.get(`/jobs/${id}`).then((res) => {
        setForm({
          title: res.data.title,
          description: res.data.description || "",
          company: res.data.company || "",
          location: res.data.location || "",
          salary: res.data.salary || "",
        });
        setLoading(false);
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form, salary: form.salary ? Number(form.salary) : null };
    try {
      if (isEditMode) {
        await api.put(`/jobs/${id}`, payload);
      } else {
        await api.post("/jobs", payload);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-6 text-slate-900">
          {isEditMode ? "Edit Job" : "Post a New Job"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="title" placeholder="Job Title" value={form.title} onChange={handleChange} className="border rounded px-3 py-2" required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border rounded px-3 py-2" rows={4} />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} className="border rounded px-3 py-2" />
          <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {isEditMode ? "Update Job" : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}