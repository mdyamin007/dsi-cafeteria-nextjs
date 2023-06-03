"use client";

import { useAuth } from "../context/authContext";

const GoogleLoginButton = () => {
  const { login, currentUser } = useAuth();
  return (
    <button onClick={login} className="bg-red-300 px-2 py-2">
      Login with google
    </button>
  );
};

export default GoogleLoginButton;
