"use client";
import Link from "next/link";
import GoogleLoginButton from "./components/GoogleLoginButton";
import { useAuth } from "./context/authContext";
import { redirect } from "next/navigation";

export default function Home() {
  const { currentUser, loading } = useAuth();
  if (currentUser) {
    redirect("/home");
  }

  return (
    <>
      {!loading && (
        <main>
          <h1>Hello World!</h1>
          <GoogleLoginButton />
          <Link href="/admin">Login as admin</Link>
        </main>
      )}
    </>
  );
}
