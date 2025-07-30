import NoteDetails from "./NoteDetails";

interface NoteDetailsPageProps {
  params: {
    id: string;
  };
}

export default function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  return <NoteDetails params={params} />;
}
