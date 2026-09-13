import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);

  const fetchSavedJobs = () => {
    api.get("/saved-jobs").then((res) => setSavedJobs(res.data));
  };

  useEffect(() => { fetchSavedJobs(); }, []);

  const handleUnsave = async (jobId) => {
    await api.delete(`/saved-jobs/${jobId}`);
    fetchSavedJobs();
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Saved Jobs</h1>
      <div className="flex flex-col gap-4">
        {savedJobs.map((sj) => (
          <div key={sj.savedJobId} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <Link to={`/jobs/${sj.jobId}`} className="flex-1">
              <h2 className="font-semibold text-slate-900">{sj.title}</h2>
              <p className="text-slate-600 text-sm">{sj.company} — {sj.location}</p>
            </Link>
            <button
              onClick={() => handleUnsave(sj.jobId)}
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        {savedJobs.length === 0 && <p className="text-slate-500">No saved jobs yet.</p>}
      </div>
    </div>
  );
}