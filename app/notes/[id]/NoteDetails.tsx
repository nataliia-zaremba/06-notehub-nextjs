"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById, deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import { getNoteQueryKey } from "./page"; // Імпортуємо ключ запиту з серверного компонента
// Видалено відсутні компоненти - замінено на вбудовані рішення
import toast from "react-hot-toast";

// Інтерфейс для пропсів компонента
interface NoteDetailsProps {
  noteId: string;
  initialData: Note;
}

export default function NoteDetails({ noteId, initialData }: NoteDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Стан для простих модальних вікон
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(initialData?.title || "");
  const [editContent, setEditContent] = useState(initialData?.content || "");
  const [isDeleting, setIsDeleting] = useState(false);

  // Використовуємо React Query з гідратованими даними
  const {
    data: note,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: getNoteQueryKey(noteId),
    queryFn: () => fetchNoteById(noteId),
    initialData, // Використовуємо початкові дані з сервера
    staleTime: 60 * 1000, // 1 хвилина
    gcTime: 5 * 60 * 1000, // 5 хвилин
    retry: (failureCount, error) => {
      // Не повторюємо запит для 404 помилок
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Оновлюємо стан редагування при зміні даних нотатки
  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
    }
  }, [note]);

  // Обробник видалення нотатки
  const handleDelete = async () => {
    if (!note) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${note.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteNote(note.id);

      // Оновлюємо кеш React Query
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.removeQueries({ queryKey: getNoteQueryKey(noteId) });

      toast.success("Note deleted successfully");
      router.push("/notes");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  // Обробник редагування нотатки
  const handleEdit = () => {
    if (!note) return;
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  // Обробник збереження змін
  const handleSaveEdit = async () => {
    if (!note) return;

    try {
      // Тут ви можете використати updateNote API функцію
      // const updatedNote = await updateNote(note.id, { title: editTitle, content: editContent });

      // Поки що просто оновлюємо локальний стан
      const updatedNote = { ...note, title: editTitle, content: editContent };

      queryClient.setQueryData(getNoteQueryKey(noteId), updatedNote);
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      setIsEditing(false);
      toast.success("Note updated successfully");
    } catch (error) {
      console.error("Failed to update note:", error);
      toast.error("Failed to update note");
    }
  };

  // Обробник скасування редагування
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
    }
  };

  // Обробка завантаження (не повинно відбуватися завдяки initialData)
  if (isLoading && !note) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading note details...</span>
      </div>
    );
  }

  // Обробка помилок
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-600 text-xl font-semibold">
          Failed to Load Note
        </div>
        <div className="text-gray-600 text-center">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </div>
        <div className="space-x-4">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/notes")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  // Якщо немає даних нотатки
  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-gray-600 text-xl font-semibold">
          Note Not Found
        </div>
        <button
          onClick={() => router.push("/notes")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Notes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Хлібні крихти */}
      <nav className="mb-6 text-sm text-gray-600">
        <button
          onClick={() => router.push("/notes")}
          className="hover:text-blue-600 transition-colors"
        >
          ← Back to Notes
        </button>
      </nav>

      {/* Заголовок з діями */}
      <div className="flex justify-between items-start mb-6">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-3xl font-bold text-gray-900 mb-2 border-b-2 border-blue-500 bg-transparent focus:outline-none w-full"
              placeholder="Note title"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {note.title}
            </h1>
          )}
          <div className="text-sm text-gray-500 space-x-4">
            <span>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </span>
            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <span>
                Updated: {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Контент нотатки */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="prose max-w-none">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Note content"
            />
          ) : (
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {note.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
