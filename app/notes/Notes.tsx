import NotesClient from "./Notes.client";
import type { FetchNotesResponse } from "../../lib/api";

interface NotesProps {
  initialNotesData: FetchNotesResponse | null;
  initialPage: number;
  initialSearch: string;
}

const Notes: React.FC<NotesProps> = ({
  initialNotesData,
  initialPage,
  initialSearch,
}) => {
  return (
    <main>
      <div>
        <h1>Notes</h1>
        <NotesClient
          initialNotesData={initialNotesData}
          initialPage={initialPage}
          initialSearch={initialSearch}
        />
      </div>
    </main>
  );
};

export default Notes;
