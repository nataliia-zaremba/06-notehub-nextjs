import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import NoteDetailsClient from "../[id]/NoteDetails.client";

interface NoteDetailsProps {
  params: {
    id: string;
  };
}

const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const id = Number(params.id);
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
    });
  } catch {
    // handle error if needed
  }

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </main>
  );
};

export default NoteDetails;
