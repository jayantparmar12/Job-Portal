import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/jobs").then((res) => setJobs(res.data));
  }, []);

  const filteredJobs = jobs.filter((job) => {
  const searchWords = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (searchWords.length === 0) return true;

  const jobText = `${job.title} ${job.company} ${job.location} ${job.description}`.toLowerCase();

  // Match if ANY search word is found anywhere in job's combined text
  return searchWords.some((word) => jobText.includes(word));
});

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4 text-slate-900">Open Positions</h1>
      <input
        type="text" placeholder="Search by title or company..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-6"
      />
      <div className="flex flex-col gap-4">
        {filteredJobs.map((job) => (
          <Link
            key={job.id} to={`/jobs/${job.id}`}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
            <p className="text-slate-600">{job.company} — {job.location}</p>
            {job.salary && <p className="text-green-600 font-medium">₹{job.salary}</p>}
          </Link>
        ))}
        {filteredJobs.length === 0 && <p className="text-slate-500">No jobs found.</p>}
      </div>
    </div>
  );
}