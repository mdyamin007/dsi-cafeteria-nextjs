"use client";

import { redirect } from "next/navigation";
import { useAuth } from "../context/authContext";

const Home = () => {
  const { logout, currentUser } = useAuth();

  if (!currentUser) {
    redirect("/");
  }

  return (
    <div>
      <div>Home</div>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default Home;
