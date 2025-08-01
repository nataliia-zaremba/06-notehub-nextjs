"use client"; // Error компоненти повинні бути клієнтськими

import { useEffect } from "react";
import css from "./error.module.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NotesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Логування помилки
    console.error("Notes page error:", error);
  }, [error]);

  return (
    <div className={css.errorContainer}>
      <div className={css.errorContent}>
        <h2 className={css.errorTitle}>Something went wrong!</h2>
        <p className={css.errorMessage}>
          Failed to load notes. Please try again.
        </p>

        {/* Показуємо деталі помилки тільки в development */}
        {process.env.NODE_ENV === "development" && (
          <details className={css.errorDetails}>
            <summary>Error details</summary>
            <pre className={css.errorPre}>{error.message}</pre>
          </details>
        )}

        <div className={css.errorActions}>
          <button onClick={reset} className={css.retryButton}>
            Try again
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className={css.homeButton}
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
