"use client";
import { auth, provider } from "@/firebase/config";
import { getRedirectResult, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Add an event listener to Firebase authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setLoading(false)
        setError(null)
      } else {
        localStorage.removeItem('user');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Check if there is a user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setLoading(false);
    }

    return () => {
      // Clean up the event listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const login = async () => {
    const result = await signInWithPopup(auth, provider)
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    loading,
    error,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
