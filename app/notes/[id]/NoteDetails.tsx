import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import NoteDetailsClient from "../NoteDetails.client";

interface NoteDetailsProps {
  params: {
    id: string;
  };
}

const NoteDetails: React.FC<NoteDetailsProps> = async ({ params }) => {
  const id = Number(params.id);
  const queryClient = new QueryClient();

  // Prefetch data on server
  try {
    await queryClient.prefetchQuery({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
    });
  } catch (error) {
    // Error will be handled by error.tsx
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
