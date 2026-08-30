import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data));
  }, [id]);


  // component ke andar
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      navigate("/my-jobs");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete job");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setMessage("Only PDF files are allowed");
      setResumeFile(null);
      return;
    }
    setMessage("");
    setResumeFile(file);
  };

  const handleApply = async () => {
    if (!resumeFile) {
      setMessage("Please upload your resume before applying");
      return;
    }

    setUploading(true);
    setMessage("");
    try {
      // Step 1: Upload resume file
      const formData = new FormData();
      formData.append("file", resumeFile);

      const uploadRes = await api.post("/upload/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resumeUrl = uploadRes.data.url;

      // Step 2: Submit application with resume URL
      await api.post("/applications", { jobId: id, resumeUrl });

      setApplied(true);
      setMessage("Applied successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply");
    } finally {
      setUploading(false);
    }
  };

  if (!job) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
        <p className="text-slate-600 mb-2">{job.company} — {job.location}</p>
        {job.salary && <p className="text-green-600 font-medium mb-4">₹{job.salary}</p>}
        <p className="text-slate-700 whitespace-pre-line">{job.description}</p>

        {message && <p className="mt-4 text-blue-600">{message}</p>}

        {user?.role === "CANDIDATE" && !applied && (
          <div className="mt-6 flex flex-col gap-3">
            <label className="text-sm text-slate-600">
              Upload Resume (PDF only)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="border rounded px-3 py-2"
            />
            <button
              onClick={handleApply}
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 w-fit"
            >
              {uploading ? "Applying..." : "Apply Now"}
            </button>
          </div>
        )}

        {!user && (
          <p className="mt-6 text-slate-500">
            <Link to="/login" className="text-blue-600">Login</Link> as a candidate to apply.
          </p>
        )}

        {user?.role === "RECRUITER" && user.email === job.postedByEmail && (
          <div className="flex gap-3 mt-6">
            <Link
              to={`/edit-job/${job.id}`}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit Job
            </Link>
            <Link
              to={`/jobs/${job.id}/applicants`}
              className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800"
            >
              View Applicants
            </Link>
            {user?.role === "RECRUITER" && user.email === job.postedByEmail && (
              <div className="flex gap-3 mt-6">
                <Link
                  to={`/edit-job/${job.id}`}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit Job
                </Link>
                <Link
                  to={`/jobs/${job.id}/applicants`}
                  className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800"
                >
                  View Applicants
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete Job
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}