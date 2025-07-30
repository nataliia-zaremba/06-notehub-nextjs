import Link from "next/link";
import { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.header}>
            <h3 className={css.title}>{note.title}</h3>
            <span className={css.tag}>{note.tag}</span>
          </div>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <p className={css.date}>
              Created: {new Date(note.createdAt).toISOString().split("T")[0]}
            </p>
            <div className={css.actions}>
              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>
              <button className={css.deleteButton}>Delete</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
