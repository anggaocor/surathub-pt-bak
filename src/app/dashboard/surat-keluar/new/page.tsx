"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function TambahSuratKeluar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    no_surat: "",
    tanggal_surat: "",
    tujuan: "",
    perihal: "",
    keterangan: "",
  });
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = null;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("arsip-surat")
          .upload(`surat_keluar/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("arsip-surat")
          .getPublicUrl(`surat_keluar/${fileName}`);

        fileUrl = publicUrl.publicUrl;
      }

      const { error } = await supabase.from("surat_keluar").insert([
        {
          no_surat: form.no_surat,
          tanggal_surat: form.tanggal_surat,
          tujuan: form.tujuan,
          perihal: form.perihal,
          file_surat: fileUrl,
          keterangan: form.keterangan,
        },
      ]);

      if (error) throw error;

      alert("✅ Surat masuk berhasil ditambahkan!");
      router.push("/dashboard/surat-keluar");
    } catch (error: any) {
      alert("❌ Gagal menambahkan surat: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Tambah Surat Keluar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nomor Surat"
          value={form.no_surat}
          onChange={(e) => setForm({ ...form, no_surat: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="date"
          value={form.tanggal_surat}
          onChange={(e) => setForm({ ...form, tanggal_surat: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Tujuan"
          value={form.tujuan}
          onChange={(e) => setForm({ ...form, tujuan: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Perihal"
          value={form.perihal}
          onChange={(e) => setForm({ ...form, perihal: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          placeholder="Keterangan"
          value={form.keterangan}
          onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
          className="border p-2 w-full rounded"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 w-full rounded"
          accept=".pdf,.jpg,.png"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
