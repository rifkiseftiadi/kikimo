"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

export default function AdminPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: '', category: '', price: '', image: '', description: '' });
  const [loading, setLoading] = useState(false);

  if (!session || session.user.role !== "admin") {
    return <div className="p-8 text-center">Akses admin saja</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setLoading(false);
    if (res.ok) {
      Swal.fire('Sukses', 'Produk berhasil ditambah', 'success');
      setForm({ name: '', category: '', price: '', image: '', description: '' });
    } else {
      Swal.fire('Gagal', 'Gagal menambah produk', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Nama Produk" className="input input-bordered w-full" />
        <input name="category" value={form.category} onChange={handleChange} required placeholder="Kategori" className="input input-bordered w-full" />
        <input name="price" value={form.price} onChange={handleChange} required placeholder="Harga" type="number" className="input input-bordered w-full" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="URL Gambar" className="input input-bordered w-full" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" className="textarea textarea-bordered w-full" />
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Menyimpan...' : 'Tambah Produk'}</button>
      </form>
    </div>
  );
}
