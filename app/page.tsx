"use client";

import { useAuth } from "./AuthContext";
import Login from "./Login";
import Schedule from "./Schedule";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Schedule />;
}
