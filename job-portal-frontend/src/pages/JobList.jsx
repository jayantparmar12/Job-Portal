import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    api.get(`/jobs?page=${page}&size=10&sortBy=${sortBy}&sortDir=${sortDir}`)
      .then((res) => {
        setJobs(res.data.content);
        setTotalPages(res.data.totalPages);
      });
  }, [page, sortBy, sortDir]);

  const filteredJobs = jobs.filter((job) => {
    const searchWords = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (searchWords.length === 0) return true;
    const jobText = `${job.title} ${job.company} ${job.location} ${job.description}`.toLowerCase();
    return searchWords.some((word) => jobText.includes(word));
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4 text-slate-900">Open Positions</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text" placeholder="Search by title, company, location..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <select
          value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="id">Newest</option>
          <option value="salary">Salary</option>
          <option value="title">Title</option>
        </select>
        <select
          value={sortDir} onChange={(e) => setSortDir(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

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

      {/* Pagination controls */}
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
    </div>
  );
}