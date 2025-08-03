import dynamic from "next/dynamic";

// Динамічний імпорт клієнтського компонента без SSR
const NoteDetailsClient = dynamic(() => import("./NoteDetails.client"), {
  ssr: false,
});

export default function NoteDetails() {
  return <NoteDetailsClient />;
}
