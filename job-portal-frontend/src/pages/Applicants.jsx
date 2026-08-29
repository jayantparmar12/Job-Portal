import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Applicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  const fetchApplicants = () => {
    api.get(`/applications/job/${jobId}`).then((res) => setApplicants(res.data));
  };

  useEffect(() => { fetchApplicants(); }, [jobId]);

  const updateStatus = async (appId, status) => {
    await api.put(`/applications/${appId}/status`, { status });
    fetchApplicants();
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Applicants</h1>
      <div className="flex flex-col gap-4">
        {applicants.map((app) => (
          <div key={app.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="font-medium text-slate-900">{app.candidateEmail}</p>
              <p className="text-sm text-slate-500">{app.status}</p>
              {app.resumeUrl && (
                
                  <a href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline"
                >
                  View Resume
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateStatus(app.id, "SHORTLISTED")} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Shortlist</button>
              <button onClick={() => updateStatus(app.id, "REJECTED")} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Reject</button>
            </div>
          </div>
        ))}
        {applicants.length === 0 && <p className="text-slate-500">No applicants yet.</p>}
      </div>
    </div>
  );
}