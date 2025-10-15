"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [totalMasuk, setTotalMasuk] = useState<number>(0);
  const [totalKeluar, setTotalKeluar] = useState<number>(0);
  const [recentMasuk, setRecentMasuk] = useState<any[]>([]);
  const [recentKeluar, setRecentKeluar] = useState<any[]>([]);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
      fetchData();
    }

    async function fetchData() {
      // Ambil jumlah total surat
      const { count: countMasuk } = await supabase
        .from("surat_masuk")
        .select("*", { count: "exact", head: true });
      const { count: countKeluar } = await supabase
        .from("surat_keluar")
        .select("*", { count: "exact", head: true });

      setTotalMasuk(countMasuk || 0);
      setTotalKeluar(countKeluar || 0);

      // Ambil 5 data terakhir surat masuk & keluar
      const { data: masuk } = await supabase
        .from("surat_masuk")
        .select("*")
        .order("tanggal_surat", { ascending: false })
        .limit(5);

      const { data: keluar } = await supabase
        .from("surat_keluar")
        .select("*")
        .order("tanggal_surat", { ascending: false })
        .limit(5);

      setRecentMasuk(masuk || []);
      setRecentKeluar(keluar || []);
    }

    checkAuth();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) return <p className="p-4">Memeriksa sesi...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-2">Dashboard Arsip Surat PT Berkah Adha Kreasindo</h1>
      <p className="flex justify-end">Selamat datang, {user.email}</p>
      <p className="text-sm text-gray-500 flex justify-end">
        Role: {user.user_metadata?.role || "user"}
      </p>

      {/* Tombol Navigasi */}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {user.user_metadata?.role === "admin" && (
          <button
           onClick={() => router.push("/dashboard/register-user")}
           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
           Register User
          </button>
        )}
        <button
          onClick={() => router.push("/dashboard/surat-masuk")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          Surat Masuk
        </button>

        <button
          onClick={() => router.push("/dashboard/surat-keluar")}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 cursor-pointer"
        >
          Surat Keluar
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Statistik */}
      <div className="mt-10 grid grid-cols-2 gap-6">
        <div className="bg-green-100 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Total Surat Masuk</h2>
          <p className="text-4xl font-bold text-green-700">{totalMasuk}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Total Surat Keluar</h2>
          <p className="text-4xl font-bold text-yellow-700">{totalKeluar}</p>
        </div>
      </div>

      {/* Daftar Terbaru */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Surat Masuk */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-500">Surat Masuk Terbaru</h3>
          {recentMasuk.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada data.</p>
          ) : (
            <ul className="text-sm">
              {recentMasuk.map((item) => (
                <li key={item.id} className="border-b py-2">
                  <p className="font-medium text-blue-500">{item.no_surat}</p>
                  <p className="text-gray-500 text-xs">
                    Dari: {item.pengirim} | {item.tanggal_surat}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Surat Keluar */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-500">Surat Keluar Terbaru</h3>
          {recentKeluar.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada data.</p>
          ) : (
            <ul className="text-sm">
              {recentKeluar.map((item) => (
                <li key={item.id} className="border-b py-2">
                  <p className="font-medium text-blue-500">{item.no_surat}</p>
                  <p className="text-gray-500 text-xs">
                    Kepada: {item.tujuan} | {item.tanggal_surat}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
