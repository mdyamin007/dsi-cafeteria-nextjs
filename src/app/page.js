"use client";
import Link from "next/link";
import GoogleLoginButton from "./components/GoogleLoginButton";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const metadata = {
  title: 'DSi Cafeteria',
  description: 'DSi Cafeteria occupancy counter',
}

export default function App() {
  const { user, loading } = useSelector(state => state.auth)


  useEffect(() => {
    const adminUsername = localStorage.getItem("adminUsername");
    const adminPassword = localStorage.getItem("adminPassword");
    if (adminUsername === "admin" && adminPassword === "dsi2001") redirect("/admin")
  }, []);

  if (user) {
    redirect("/home");
  }


  return (
    <>
      {!loading && (
        <main>
          <div className="flex items-center justify-center flex-col gap-4 px-20 py-20 my-16 md:my-40">
            <GoogleLoginButton />
            <Link className="text-blue-400 mt-10" href="/admin">Login as admin</Link>
          </div>
        </main>
      )}
    </>
  );
}
