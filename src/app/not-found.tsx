import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#07060b] p-4 text-center text-white">
      <h2 className="mb-2 text-4xl font-extrabold text-purple-400">404</h2>
      <p className="mb-6 text-slate-400">Página no encontrada.</p>
      <Link
        href="/"
        className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
