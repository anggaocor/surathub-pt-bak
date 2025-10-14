"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface SuratMasuk {
  id: string;
  no_surat: string;
  tanggal_surat: string;
  pengirim: string;
  perihal: string;
  file_surat?: string;
  keterangan?: string;
}

export default function DaftarSuratMasuk() {
  const [data, setData] = useState<SuratMasuk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuratMasuk();
  }, []);

  async function getSuratMasuk() {
    setLoading(true);
    const { data, error } = await supabase
      .from("surat_masuk")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setData(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm("Yakin ingin menghapus surat ini?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("surat_masuk").delete().eq("id", id);
    if (error) alert("Gagal menghapus surat: " + error.message);
    else {
      alert("✅ Surat berhasil dihapus!");
      setData(data.filter((item) => item.id !== id));
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Daftar Surat Masuk</h1>
        <Link
          href="/dashboard/surat-masuk/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Surat
        </Link>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : data.length === 0 ? (
        <p>Tidak ada surat masuk.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full bg-white text-gray-600">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">No</th>
                <th className="p-3">Nomor Surat</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Pengirim</th>
                <th className="p-3">Perihal</th>
                <th className="p-3">File</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.no_surat}</td>
                  <td className="p-3">{item.tanggal_surat}</td>
                  <td className="p-3">{item.pengirim}</td>
                  <td className="p-3">{item.perihal}</td>
                  <td className="p-3">
                    {item.file_surat ? (
                      <a
                        href={item.file_surat}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        Lihat File
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 space-x-2 flex flex-col md:flex-row">
                    <Link
                      href={`/dashboard/surat-masuk/${item.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                    >
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
