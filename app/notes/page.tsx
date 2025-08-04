import { fetchNotes } from "../../lib/api";
import type { FetchNotesResponse } from "../../lib/api";
import Notes from "./Notes";

interface SearchParams {
  page?: string | string[];
  search?: string | string[];
}

// Серверний компонент для завантаження початкових даних
export default async function NotesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Обробка searchParams з урахуванням можливості масивів значень
  const pageParam = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const searchParam = Array.isArray(searchParams.search)
    ? searchParams.search[0]
    : searchParams.search;

  const page = parseInt(pageParam || "1", 10);
  const search = searchParam || "";

  // Завантажуємо початкові дані на сервері
  let initialNotesData: FetchNotesResponse | null = null;

  try {
    initialNotesData = await fetchNotes({
      page,
      perPage: 12,
      search,
    });
  } catch (error) {
    console.error("Failed to fetch initial notes data:", error);
    // Можна передати null і обробити помилку на клієнті
  }

  return (
    <Notes
      initialNotesData={initialNotesData}
      initialPage={page}
      initialSearch={search}
    />
  );
}
