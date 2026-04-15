import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white border-b py-4 px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-1">
        <span className="bg-red-600 text-white px-2 py-0.5 rounded-lg font-bold text-xl">Recipe</span>
        <span className="text-xl font-bold tracking-tight text-gray-900">Tube</span>
      </Link>
    </header>
  );
}
