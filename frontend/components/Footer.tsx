import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-white py-6">
      <div className="text-center text-sm text-gray-400">
        <p className="mb-2 font-medium">© 2026 RecipeTube</p>
        <div className="flex justify-center gap-4">
          <Link href="/privacy-policy" className="text-blue-500 hover:underline">
            プライバシーポリシー
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/terms-of-service" className="text-blue-500 hover:underline">
            利用規約
          </Link>
        </div>
      </div>
    </footer>
  );
}
