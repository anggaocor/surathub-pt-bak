"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // cek role di metadata Supabase
      if (user.user_metadata?.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setSessionUser(user);
      setLoading(false);
    }

    checkUser();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Membuat user...");

    const res = await fetch("/api/admin-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ User berhasil dibuat!");
      setForm({ email: "", password: "", role: "user" });
    } else {
      setMessage(`❌ Error: ${data.error}`);
    }
  }

  if (loading) return <p className="p-4">Memeriksa akses...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Register User Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border w-full p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border w-full p-2 rounded"
          required
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border w-full p-2 rounded text-gray-500"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
          Daftarkan
      </button>
      <button
        onClick={() => { router.push("/dashboard") }}
        className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
        >
        Dashboard
      </button>
      </form>
          {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
