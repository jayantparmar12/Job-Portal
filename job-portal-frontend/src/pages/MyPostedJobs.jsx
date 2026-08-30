import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function MyPostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [message, setMessage] = useState("");

  const fetchMyJobs = () => {
    api.get(`/jobs/my-jobs?page=${page}&size=10`).then((res) => {
      setJobs(res.data.content);
      setTotalPages(res.data.totalPages);
    });
  };

  useEffect(() => { fetchMyJobs(); }, [page]);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      setMessage("Job deleted successfully");
      fetchMyJobs();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">My Posted Jobs</h1>
      {message && <p className="text-blue-600 mb-4">{message}</p>}

      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-5 rounded-lg shadow flex justify-between items-center">
            <Link to={`/jobs/${job.id}`} className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
              <p className="text-slate-600">{job.company} — {job.location}</p>
              {job.salary && <p className="text-green-600 font-medium">₹{job.salary}</p>}
            </Link>
            <div className="flex gap-2">
              <Link
                to={`/edit-job/${job.id}`}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                Edit
              </Link>
              <Link
                to={`/jobs/${job.id}/applicants`}
                className="bg-slate-700 text-white px-3 py-1 rounded text-sm hover:bg-slate-800"
              >
                Applicants
              </Link>
              <button
                onClick={() => handleDelete(job.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-slate-500">You haven't posted any jobs yet.</p>}
      </div>

      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-slate-600">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}