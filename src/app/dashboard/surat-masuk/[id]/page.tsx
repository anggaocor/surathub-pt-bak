"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditSuratKeluarPage() {
  const { id } = useParams(); // ambil id dari URL
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    no_surat: "",
    tanggal_surat: "",
    pengirim: "",
    perihal: "",
    keterangan: "",
    file_surat: "",
  });

  const [file, setFile] = useState<File | null>(null);

  // Ambil data surat berdasarkan ID
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("surat_masuk")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Gagal memuat data surat:", error.message);
      } else {
        setForm({
          no_surat: data.no_surat || "",
          tanggal_surat: data.tanggal_surat || "",
          pengirim: data.pengirim || "",
          perihal: data.perihal || "",
          keterangan: data.keterangan || "",
          file_surat: data.file_surat || "",
        });
      }
      setLoading(false);
    }

    if (id) fetchData();
  }, [id]);

  // Handle perubahan input
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Submit form update
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = form.file_surat;

      // Jika file baru diupload, ganti file lama
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `surat_masuk/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("arsip-surat")
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("arsip-surat")
          .getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
      }

      // Update data surat di tabel
      const { error: updateError } = await supabase
        .from("surat_masuk")
        .update({
          no_surat: form.no_surat,
          tanggal_surat: form.tanggal_surat,
          pengirim: form.pengirim,
          perihal: form.perihal,
          keterangan: form.keterangan,
          file_surat: fileUrl,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      alert("✅ Surat masuk berhasil diperbarui!");
      router.push("/dashboard/surat-masuk");
    } catch (error: any) {
      alert("❌ Gagal memperbarui surat: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="p-4">Memuat data...</p>;

  return (
    <div className="mt-4 max-w-3xl mx-auto p-6 bg-white rounded-xl shadow text-gray-500">
      <h1 className="text-2xl font-bold mb-4">Edit Surat Masuk</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nomor Surat</label>
          <input
            type="text"
            name="no_surat"
            value={form.no_surat}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tanggal Surat</label>
          <input
            type="date"
            name="tanggal_surat"
            value={form.tanggal_surat}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Pengirim</label>
          <input
            type="text"
            name="pengirim"
            value={form.pengirim}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Perihal</label>
          <input
            type="text"
            name="perihal"
            value={form.perihal}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Keterangan</label>
          <textarea
            name="keterangan"
            value={form.keterangan}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">File Surat (opsional)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border rounded p-2"
          />
          {form.file_surat && (
            <a
              href={form.file_surat}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm underline mt-1 inline-block"
            >
              Lihat file lama
            </a>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/surat-masuk")}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
