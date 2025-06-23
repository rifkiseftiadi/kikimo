"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Swal from "sweetalert2";
import Image from "next/image";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import SkeletonCard from "../../components/SkeletonCard";
import EmptyState from "../../components/EmptyState";

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session && session.user.role === "admin") {
      setLoading(true);
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        });
    }
  }, [session]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      Swal.fire("Sukses", "Produk dihapus", "success");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  if (!session || session.user.role !== "admin") {
    return <div className="p-8 text-center">Akses admin saja</div>;
  }

  return (
    <div className="max-w-4xl w-full mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-xl mt-6 border border-blue-100">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Kelola Produk
        <PlusIcon className="h-7 w-7 text-blue-600" />
      </h1>
      <Link href="/admin/products/add" className="btn btn-primary mb-4 flex items-center gap-2">
        <PlusIcon className="h-5 w-5" /> Tambah Produk
      </Link>
      <button
        className="btn bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-md rounded-xl px-6 py-2 flex items-center gap-2 hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition focus:ring-2 focus:ring-blue-400 mb-4 ml-2"
        onClick={() => window.location.reload()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582a2 2 0 011.789 1.106l.94 1.88A2 2 0 0010.11 14h3.78a2 2 0 001.799-1.114l.94-1.88A2 2 0 0119.418 9H20V4" /></svg>
        Refresh
      </button>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState message="Belum ada produk tersedia." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow-lg p-4 flex flex-col border border-blue-100 hover:shadow-2xl hover:scale-105 transition group rounded-xl">
              {product.image && (
                <Image
                  src={(() => {
                    if (product.image.startsWith('http')) return product.image;
                    if (product.image.startsWith('/')) return product.image;
                    if (/\.(jpg|jpeg|png|webp|svg)$/i.test(product.image)) return `/uploads/${product.image}`;
                    return `/uploads/${product.image}`;
                  })()}
                  alt={product.name}
                  width={300}
                  height={160}
                  className="mb-2 rounded group-hover:scale-105 transition h-40 w-full object-cover"
                  unoptimized={product.image.startsWith('http')}
                  onError={e => { e.currentTarget.src = '/vercel.svg'; }}
                />
              )}
              <div className="font-bold text-lg text-blue-800 mb-1">{product.name}</div>
              <span className="badge badge-info mb-2">{product.category}</span>
              <div className="my-2 text-xl font-semibold text-purple-700">Rp{product.price.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mb-2">{product.description}</div>
              <div className="flex gap-2 mt-2">
                <Link href={`/admin/products/edit/${product._id}`} className="btn btn-sm btn-warning flex items-center gap-1"><PencilIcon className="h-4 w-4" /> Edit</Link>
                <button className="btn btn-sm btn-error flex items-center gap-1" onClick={() => handleDelete(product._id)}><TrashIcon className="h-4 w-4" /> Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
