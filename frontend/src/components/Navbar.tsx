"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold hover:text-gray-300">
              QuestLog
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="hover:text-gray-300">
                  Dashboard
                </Link>
                <Link href="/rpg" className="hover:text-gray-300">
                  Meus RPGs
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-400">{user.name}</span>
                <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              ☰
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 text-white px-4 pt-2 pb-4 space-y-2">
          <Link href="/" className="block hover:text-gray-300">
            Home
          </Link>
          {user && (
            <>
              <Link href="/dashboard" className="block hover:text-gray-300">
                Dashboard
              </Link>
              <Link href="/rpg" className="block hover:text-gray-300">
                Meus RPGs
              </Link>
            </>
          )}
          {user ? (
            <button onClick={handleLogout} className="w-full bg-red-600 px-3 py-2 rounded hover:bg-red-700">
              Logout
            </button>
          ) : (
            <Link href="/login" className="block bg-blue-600 px-3 py-2 rounded hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
