import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-5xl font-bold">Bem-vindo ao QuestLog</h1>
      <p className="text-gray-400 mt-4 text-lg">Gerencie suas campanhas de RPG de forma simples e organizada.</p>
      <Link href="/login">
        <button className="mt-6 px-6 py-3 bg-blue-600 rounded-lg text-lg hover:bg-blue-700">
          Acessar o Sistema
        </button>
      </Link>
    </div>
  );
}
