import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setProfile(res.data);
      setName(res.data.name);
    });
  }, []);

  const handleSave = async () => {
    try {
      const res = await api.put("/users/me", { name });
      setProfile(res.data);
      setEditing(false);
      setMessage("Profile updated!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update");
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">My Profile</h2>
      {message && <p className="text-blue-600 mb-4">{message}</p>}

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-slate-500">Name</label>
          {editing ? (
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          ) : (
            <p className="text-lg text-slate-900">{profile.name}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-slate-500">Email</label>
          <p className="text-lg text-slate-900">{profile.email}</p>
        </div>

        <div>
          <label className="text-sm text-slate-500">Role</label>
          <p className="text-lg text-slate-900">{profile.role}</p>
        </div>

        {editing ? (
          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save
            </button>
            <button onClick={() => { setEditing(false); setName(profile.name); }} className="bg-slate-300 px-4 py-2 rounded hover:bg-slate-400">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}