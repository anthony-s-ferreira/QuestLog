import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-900 text-white">
        <Navbar />
        <main className="p-6">
          <h1 className="text-3xl font-bold">Bem-vindo ao QuestLog</h1>
          <p className="mt-2 text-gray-400">Gerencie seus RPGs e eventos facilmente.</p>
        </main>
      </div>
    </div>
  );
}
