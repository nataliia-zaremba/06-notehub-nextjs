import NoteDetails from "./NoteDetails";

interface NoteDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  return <NoteDetails params={params} />;
}
