"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center bg-[#313338] rounded-lg border border-accent/50 p-8">
      <h2 className="text-2xl font-bold text-white">Coś poszło nie tak!</h2>
      <p className="text-gray-400">Nie udało się połączyć z API Discorda lub pobrać danych.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors mt-4"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}