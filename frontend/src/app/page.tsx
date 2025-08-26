import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">Hospital Bed Allocation System</h1>
      <div className="flex gap-4">
        <Link
          href="/admit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Admit Patient
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
