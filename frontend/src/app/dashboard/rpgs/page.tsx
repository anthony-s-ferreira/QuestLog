"use client";
import { useEffect, useState } from "react";
import { getRPGs } from "@/services/rpgService";

export default function RPGs() {
  const [rpgs, setRPGs] = useState([]);

  useEffect(() => {
    getRPGs().then(setRPGs);
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold">Meus RPGs</h1>
      <ul className="mt-4">
        {rpgs.map((rpg) => (
          <li key={rpg.id} className="bg-gray-800 p-4 mb-2 rounded">
            <strong>{rpg.name}</strong> - Mestre: {rpg.master}
          </li>
        ))}
      </ul>
    </div>
  );
}
