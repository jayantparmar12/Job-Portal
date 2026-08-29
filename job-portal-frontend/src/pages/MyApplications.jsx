import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get("/applications/my").then((res) => setApps(res.data));
  }, []);

  const statusColor = {
    APPLIED: "bg-yellow-100 text-yellow-800",
    SHORTLISTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">My Applications</h1>
      <div className="flex flex-col gap-4">
        {apps.map((app) => (
          <div key={app.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <span className="font-medium text-slate-900">{app.jobTitle}</span>
            <span className={`px-3 py-1 rounded-full text-sm ${statusColor[app.status]}`}>
              {app.status}
            </span>
          </div>
        ))}
        {apps.length === 0 && <p className="text-slate-500">You haven't applied to any jobs yet.</p>}
      </div>
    </div>
  );
}