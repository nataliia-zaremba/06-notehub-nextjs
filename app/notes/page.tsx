import { fetchNotes } from "../../lib/api";
import type { FetchNotesResponse } from "../../lib/api";
import Notes from "./Notes";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const search = searchParams.search || "";

  let initialNotesData: FetchNotesResponse | null = null;

  try {
    initialNotesData = await fetchNotes({
      page,
      perPage: 12,
      search,
    });
  } catch (error) {
    console.error("Failed to fetch initial notes data:", error);
  }

  return (
    <Notes
      initialNotesData={initialNotesData}
      initialPage={page}
      initialSearch={search}
    />
  );
}
