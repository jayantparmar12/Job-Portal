import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  // Debounce search input — waits 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // reset to first page on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const keywordParam = debouncedSearch ? `&keyword=${encodeURIComponent(debouncedSearch)}` : "";
    api.get(`/jobs?page=${page}&size=10&sortBy=${sortBy}&sortDir=${sortDir}${keywordParam}`)
      .then((res) => {
        setJobs(res.data.content);
        setTotalPages(res.data.totalPages);
      });
  }, [page, sortBy, sortDir, debouncedSearch]);

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
          value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
          className="border rounded px-3 py-2"
        >
          <option value="id">Newest</option>
          <option value="salary">Salary</option>
          <option value="title">Title</option>
        </select>
        <select
          value={sortDir} onChange={(e) => { setSortDir(e.target.value); setPage(0); }}
          className="border rounded px-3 py-2"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <Link
            key={job.id} to={`/jobs/${job.id}`}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-slate-900">{job.title}</h2>
            <p className="text-slate-600">{job.company} — {job.location}</p>
            {job.salary && <p className="text-green-600 font-medium">₹{job.salary}</p>}
          </Link>
        ))}
        {jobs.length === 0 && <p className="text-slate-500">No jobs found.</p>}
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