import NoteDetails from "./NoteDetails";

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; // Тепер params є Promise
}) {
  // Очікуємо розв'язання Promise
  const resolvedParams = await params;

  return <NoteDetails params={resolvedParams} />;
}
