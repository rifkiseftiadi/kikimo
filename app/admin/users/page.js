"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session && session.user.role === "admin") {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
          setLoading(false);
        });
    }
  }, [session]);

  const handleRoleChange = async (userId, newRole) => {
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    if (res.ok) {
      Swal.fire("Sukses", "Role user diubah!", "success");
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleDelete = async (userId) => {
    const res = await fetch(`/api/users?userId=${userId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      Swal.fire("Sukses", "User dihapus!", "success");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    }
  };

  if (!session || session.user.role !== "admin") {
    return <div className="p-8 text-center">Akses admin saja</div>;
  }

  return (
    <div className="max-w-4xl w-full mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-xl mt-6 border border-blue-100">
      <h1 className="text-3xl font-extrabold text-purple-700 flex items-center gap-2 mb-6">
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
        Kelola Pengguna
      </h1>
      {loading ? (
        <div className="flex items-center gap-2 text-blue-500 animate-pulse"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500 flex items-center gap-2"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>Tidak ada user.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-white rounded-xl shadow border border-purple-100 text-sm">
            <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
              <tr>
                <th className="py-3 px-4 text-purple-700 font-bold text-left">Email</th>
                <th className="py-3 px-4 text-purple-700 font-bold text-left">Role</th>
                <th className="py-3 px-4 text-purple-700 font-bold text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user._id} className={idx % 2 === 0 ? 'bg-purple-50' : 'bg-white'}>
                  <td className="py-3 px-4 font-semibold text-blue-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <select
                      className="select select-bordered select-xs bg-white border-purple-200 focus:ring-2 focus:ring-purple-400"
                      value={user.role}
                      onChange={e => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      className="btn btn-error btn-xs flex items-center gap-1 hover:scale-105 transition"
                      onClick={() => handleDelete(user._id)}
                      title="Hapus User"
                    >
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
