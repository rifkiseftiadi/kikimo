"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  if (!session || session.user.role !== "admin") {
    return <div className="p-8 text-center">Akses admin saja</div>;
  }
  return (
    <div className="max-w-4xl w-full mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-xl mt-6 border border-blue-100">
      <div className="flex justify-center mb-6">
        <Image
          src="/globe.svg"
          alt="Logo Velmo Store"
          width={112}
          height={112}
          className="w-28 h-28 rounded-full border-4 border-blue-200 bg-white drop-shadow-lg"
          priority
        />
      </div>
      <h1 className="text-3xl font-extrabold text-purple-700 flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
        Dashboard Admin
      </h1>
      <p className="mb-2 text-lg flex items-center gap-2">Selamat datang, <b className="text-blue-700">{session.user.email}</b>!
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <li className="bg-blue-50 rounded-lg p-4 flex flex-col items-center gap-2 shadow hover:shadow-lg transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c0-1.384-1.136-2.511-2.536-2.511H6.286c-1.4 0-2.536 1.127-2.536 2.511v6.978c0 1.384 1.136 2.511 2.536 2.511h11.428c1.4 0 2.536-1.127 2.536-2.511V8.511z" /></svg>
          <span className="font-semibold text-blue-700">Kelola produk</span>
          <span className="text-xs text-gray-500">Tambah, edit, hapus produk</span>
        </li>
        <li className="bg-green-50 rounded-lg p-4 flex flex-col items-center gap-2 shadow hover:shadow-lg transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
          <span className="font-semibold text-green-700">Kelola pesanan user</span>
          <span className="text-xs text-gray-500">Lihat & proses pesanan</span>
        </li>
        <li className="bg-purple-50 rounded-lg p-4 flex flex-col items-center gap-2 shadow hover:shadow-lg transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
          <span className="font-semibold text-purple-700">Kelola pengguna</span>
          <span className="text-xs text-gray-500">Lihat & kelola user</span>
        </li>
      </ul>
      <div className="mt-8 text-gray-500 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
        Gunakan menu di atas untuk navigasi fitur admin.
      </div>
    </div>
  );
}
