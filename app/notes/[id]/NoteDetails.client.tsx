"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import type { Note } from "../../../types/note";
import css from "./NoteDetails.module.css";

// Інтерфейс для пропсів компонента
interface NoteDetailsClientProps {
  initialData?: Note;
  noteId?: string;
}

const NoteDetailsClient: React.FC<NoteDetailsClientProps> = ({
  initialData,
  noteId,
}) => {
  const params = useParams();

  const id = noteId || (typeof params.id === "string" ? params.id : "");

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
    refetchOnMount: false,

    initialData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  if (isLoading && !note) {
    return (
      <div className={css.loadingContainer}>
        <div className={css.spinner}></div>
        <p>Loading, please wait...</p>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className={css.errorContainer}>
        <p className={css.errorMessage}>Something went wrong.</p>
        <p className={css.errorDetails}>
          {error instanceof Error ? error.message : "Failed to load note"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className={css.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <div className={css.metadata}>
          <p className={css.date}>
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </p>
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <p className={css.date}>
              Updated: {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
