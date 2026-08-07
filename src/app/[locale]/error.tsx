"use client";

import { useEffect } from "react";

/**
 * Filet de sécurité : une estimation ne doit jamais laisser un écran blanc.
 * L'erreur est journalisée et l'utilisateur peut relancer son estimation.
 */
export default function EstimationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[EstimaWeb] unexpected error", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-h3 font-bold text-text-primary">
        L’estimation n’a pas pu être affichée
      </h1>
      <p className="text-text-secondary">
        Une erreur inattendue est survenue. Aucune donnée n’a été transmise ni
        conservée. Vous pouvez relancer votre estimation.
      </p>
      <p className="text-sm text-text-tertiary">
        The estimate could not be displayed. No data was sent or stored. You can
        start a new estimate.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-sm bg-accent px-6 py-2.5 font-medium text-background transition-opacity hover:opacity-90"
      >
        Recommencer / Start over
      </button>
    </main>
  );
}
