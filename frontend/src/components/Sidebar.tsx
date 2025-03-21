import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 p-4 text-white">
      <h2 className="text-2xl font-bold">QuestLog</h2>
      <nav className="mt-6">
        <Link href="/dashboard/rpgs" className="block py-2 px-4 rounded hover:bg-gray-700">Meus RPGs</Link>
        <Link href="/dashboard/events" className="block py-2 px-4 rounded hover:bg-gray-700">Eventos</Link>
        <Link href="/dashboard/characters" className="block py-2 px-4 rounded hover:bg-gray-700">Personagens</Link>
      </nav>
    </aside>
  );
}
