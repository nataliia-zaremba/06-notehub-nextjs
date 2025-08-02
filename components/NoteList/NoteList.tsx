import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Note } from "../../types/note";
import { deleteNote } from "../../lib/api";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Failed to delete note:", error);
    },
  });

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <Link href={`/notes/${note.id}`} className={css.noteLink}>
            <div className={css.noteContent}>
              <h2 className={css.title}>{note.title}</h2>
              <p className={css.content}>{truncateContent(note.content)}</p>

              <div className={css.metadata}>
                <span className={css.date}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                {note.tag && <span className={css.tag}>{note.tag}</span>}
              </div>
            </div>
          </Link>

          <div className={css.footer}>
            <button
              className={css.button}
              onClick={(event) => handleDelete(note.id, event)}
              disabled={deleteMutation.isPending}
              aria-label={`Delete note: ${note.title}`}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>

            <Link
              href={`/notes/${note.id}/edit`}
              className={css.editButton}
              onClick={(event) => event.stopPropagation()}
            >
              Edit
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
