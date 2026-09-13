import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const STATUS_COLORS = {
  APPLIED: "#facc15",
  SHORTLISTED: "#22c55e",
  REJECTED: "#ef4444",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/recruiter").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p className="text-center mt-10">Loading dashboard...</p>;

  const pieData = Object.entries(stats.applicationsByStatus).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Recruiter Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.totalJobsPosted}</p>
          <p className="text-slate-500 mt-1">Jobs Posted</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-3xl font-bold text-green-600">{stats.totalApplicantsReceived}</p>
          <p className="text-slate-500 mt-1">Total Applicants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applicants per job - bar chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-slate-900 mb-4">Applicants per Job</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.applicantsPerJob}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jobTitle" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="applicantCount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Application status breakdown - pie chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-slate-900 mb-4">Application Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}