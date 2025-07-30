import NotesClient from "./Notes.client";

const Notes: React.FC = () => {
  return (
    <main>
      <div>
        <h1>Notes</h1>
        <NotesClient />
      </div>
    </main>
  );
};

export default Notes;
