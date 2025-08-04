import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

export default async function NotesPage() {
  const data = await fetchNotes({ page: 1, perPage: 12, search: "" });
  return <NotesClient initialData={data} />;
}
