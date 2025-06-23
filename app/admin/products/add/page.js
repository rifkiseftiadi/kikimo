"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", category: "", price: "", image: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setForm({ ...form, image: "" }); // Kosongkan input URL jika upload file
    }
  };

  const handleImageUrlChange = (e) => {
    setForm({ ...form, image: e.target.value });
    setImagePreview(e.target.value);
    setImageFile(null); // Kosongkan file jika input URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = form.image;
    if (imageFile) {
      const data = new FormData();
      data.append("file", imageFile);
      // Ganti endpoint berikut sesuai backend Anda
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      if (uploadRes.ok) {
        const result = await uploadRes.json();
        imageUrl = result.url;
      } else {
        setLoading(false);
        Swal.fire("Gagal", "Gagal upload gambar", "error");
        return;
      }
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image: imageUrl, price: Number(form.price) }),
    });
    setLoading(false);
    if (res.ok) {
      Swal.fire("Sukses", "Produk berhasil ditambah", "success").then(() => router.push("/products"));
    } else {
      Swal.fire("Gagal", "Gagal menambah produk", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 sm:p-10 bg-white rounded-2xl shadow-2xl mt-10 animate-fade-in flex flex-col gap-6 border border-blue-100">
      <h1 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2 mb-2">
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-9 h-9 text-blue-500 drop-shadow-lg animate-bounce">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Tambah Produk
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-blue-700 flex items-center gap-1">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            Gambar Produk
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-bordered w-full" />
          <span className="text-xs text-gray-400">atau masukkan URL gambar di bawah</span>
          <input name="image" value={form.image} onChange={handleImageUrlChange} placeholder="URL Gambar" className="input input-bordered w-full focus:ring-2 focus:ring-blue-400" />
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Preview"
              width={400}
              height={160}
              className="w-full h-40 object-cover rounded-lg border mt-2 shadow"
              unoptimized
              priority
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-semibold text-blue-700 flex items-center gap-1">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c0-1.384-1.136-2.511-2.536-2.511H6.286c-1.4 0-2.536 1.127-2.536 2.511v6.978c0 1.384 1.136 2.511 2.536 2.511h11.428c1.4 0 2.536-1.127 2.536-2.511V8.511z" />
            </svg>
            Nama Produk
          </label>
          <input name="name" id="name" value={form.name} onChange={handleChange} required placeholder="Nama Produk" className="input input-bordered w-full focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="font-semibold text-blue-700 flex items-center gap-1">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            Kategori
          </label>
          <input name="category" id="category" value={form.category} onChange={handleChange} required placeholder="Kategori" className="input input-bordered w-full focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="price" className="font-semibold text-blue-700 flex items-center gap-1">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            Harga
          </label>
          <input name="price" id="price" value={form.price} onChange={handleChange} required placeholder="Harga" type="number" className="input input-bordered w-full focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="font-semibold text-blue-700 flex items-center gap-1">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            Deskripsi
          </label>
          <textarea name="description" id="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" className="textarea textarea-bordered w-full focus:ring-2 focus:ring-blue-400" />
        </div>
        <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2 text-lg group hover:scale-105 transition focus:ring-2 focus:ring-blue-400" disabled={loading} aria-label="Tambah Produk">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {loading ? "Menyimpan..." : "Tambah Produk"}
        </button>
      </form>
    </div>
  );
}
