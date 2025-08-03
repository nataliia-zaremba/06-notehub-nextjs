import NoteDetails from "./NoteDetails";

interface NotePageProps {
  params: {
    id: string;
  };
}

export default function NotePage({ params }: NotePageProps) {
  return <NoteDetails />;
}
