import { Suspense } from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import NoteDetails from "./NoteDetails";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

// Типи для Next.js App Router
type Props = {
  params: { id: string };
};

// Ключ запиту для React Query (має бути узгоджений з клієнтським компонентом)
export const getNoteQueryKey = (id: string) => ["note", id];

// Функція для серверного завантаження даних з префетчингом
async function NoteDetailsContent({ params }: { params: { id: string } }) {
  const { id } = params;

  // Валідація ID
  if (!id || typeof id !== "string" || id.trim() === "") {
    notFound();
  }

  try {
    // Створюємо новий QueryClient для серверного рендерингу
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // Налаштування для серверного рендерингу
          staleTime: 60 * 1000, // 1 хвилина
          gcTime: 5 * 60 * 1000, // 5 хвилин (раніше cacheTime)
        },
      },
    });

    // Префетчим дані нотатки
    await queryClient.prefetchQuery({
      queryKey: getNoteQueryKey(id),
      queryFn: () => fetchNoteById(id),
      staleTime: 60 * 1000,
    });

    // Отримуємо дані для валідації
    const noteData = queryClient.getQueryData<Note>(getNoteQueryKey(id));

    // Перевіряємо, чи існує нотатка
    if (!noteData) {
      notFound();
    }

    // Валідуємо структуру даних
    if (
      !noteData.id ||
      typeof noteData.title !== "string" ||
      typeof noteData.content !== "string"
    ) {
      console.error("Invalid note data structure:", noteData);
      throw new Error("Invalid note data structure");
    }

    // Дегідратуємо стан для передачі клієнту
    const dehydratedState = dehydrate(queryClient);

    return (
      <HydrationBoundary state={dehydratedState}>
        <NoteDetails noteId={id} initialData={noteData} />
      </HydrationBoundary>
    );
  } catch (error) {
    console.error(`Failed to load note with ID ${id}:`, error);

    // Якщо помилка 404, показуємо not found
    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }

    // Для інших помилок показуємо error boundary
    throw new Error(
      `Failed to load note: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// Головний компонент сторінки
export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Очікуємо розв'язання Promise з параметрами
  const resolvedParams = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Loading Note Details
              </h2>
              <p className="text-gray-500">Please wait...</p>
            </div>
          </div>
        }
      >
        <NoteDetailsContent params={resolvedParams} />
      </Suspense>
    </div>
  );
}

// Генерація метаданих для сторінки
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = params;

    // Завантажуємо дані для метаданих
    const note = await fetchNoteById(id);

    return {
      title: `${note.title} | My Notes`,
      description:
        note.content.length > 160
          ? `${note.content.substring(0, 160)}...`
          : note.content,
      openGraph: {
        title: note.title,
        description:
          note.content.length > 160
            ? `${note.content.substring(0, 160)}...`
            : note.content,
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "Note Not Found | My Notes",
      description: "The requested note could not be found.",
    };
  }
}

export const revalidate = 300; // 5 хвилин
