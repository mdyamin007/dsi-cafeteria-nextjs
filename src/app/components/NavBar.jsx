"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/authContext";

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  return (
    <header className="text-gray-600 body-font border shadow-md">
      <div className="container mx-auto flex flex-wrap p-2 flex-col md:flex-row items-center justify-between">
        <Link
          href="/"
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <Image src="/dsi_logo.jpg" width="100" height="100" alt="DSi" />
          <span className="ml-3 text-xl">Cafeteria</span>
        </Link>
        {currentUser && (
          <nav className="md:ml-auto md:mr-auto hidden md:flex flex-wrap items-center text-base justify-center">
            <Link href="/queue" className="mr-5 hover:text-gray-900">
              Open queue
            </Link>
          </nav>
        )}

        {currentUser && (
          <div className="flex gap-8">
            <Image
              src={currentUser.photoURL}
              width="50"
              height="50"
              className="rounded-full"
              alt="user pic"
            />
            <button
              onClick={logout}
              className="text-red-600 border-2 border-red-600 px-6 py-1 rounded"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
