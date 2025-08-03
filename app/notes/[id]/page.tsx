import NoteDetails from "./NoteDetails";
import { fetchNoteById } from "@/lib/api";
import type { Metadata } from "next";

type GenerateMetadataProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const note = await fetchNoteById(String(params.id));

  return {
    title: note?.title || "Note Not Found",
    description: note?.content?.slice(0, 100) || "No content available",
  };
}

export default function Page() {
  return <NoteDetails />;
}
