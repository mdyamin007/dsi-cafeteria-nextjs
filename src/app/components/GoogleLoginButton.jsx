"use client";

import Image from "next/image";
import { useAuth } from "../context/authContext";

const GoogleLoginButton = () => {
  const { login, currentUser } = useAuth();
  return (
    <button onClick={login} className="bg-white px-4 py-2 border shadow-md flex items-center justify-center gap-2">
      <Image src="/google-logo.png" alt="google-logo" width="30" height="30" />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
