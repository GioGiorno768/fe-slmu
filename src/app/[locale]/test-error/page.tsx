"use client";

import { useState } from "react";

export default function TestErrorPage() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("Ini adalah simulasi error untuk mengetes halaman Error!");
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Halaman Test Error</h1>
      <p className="mb-6 text-gray-500">
        Klik tombol di bawah untuk memicu error dan melihat tampilan error.tsx
      </p>

      <button
        onClick={() => setShouldError(true)}
        className="bg-redshortlink text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
      >
        💥 Picu Error Sekarang
      </button>
    </div>
  );
}
