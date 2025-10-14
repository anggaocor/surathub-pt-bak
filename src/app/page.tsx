"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/dist/client/components/navigation";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("surathub-pt-bak").select("*").limit(1);
      if (error) console.error("❌ Supabase error:", error);
      else console.log("✅ Supabase connected:", data);
    };

    testConnection();
  }, []);

  return (
    <div className="flex-col items-center justify-items-center">
      <img
        src="/logo.png"
        alt="Logo"
        className="h-55 w-80 mx-auto mt-10"
      />
      <h1 className="text-small flex-auto text-center">Sistem manajemen surat masuk, surat keluar, dan penomoran surat digital untuk PT Berkah Adha Kreasindo.
        Dikembangkan dengan prinsip administrasi perkantoran modern.</h1>
      <br/>
      <p className="text-small flex-auto text-center">Proyek ini bersifat internal untuk PT Berkah Adha Kreasindo</p>
      <br/>
      <p className="text-small flex-auto text-center">👤 Pengembang - Angga Al Rasyid 📧 berkahadhakreasindo@gmail.com 💻 https://github.com/anggaocor</p>
      <div className="flex items-center justify-center my-8">
        <button 
          onClick={() => router.push("/login")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors cursor-pointer">
          Get Started
        </button>
      </div>
      <footer className="text-xl font-bold flex items-center justify-center w-full absolute bottom-0 left-0 h-16">
        © 2024 PT Berkah Adha Kreasindo
      </footer>
    </div>
  )
}
