export type NoteTagType = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: NoteTagType;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTagType;
  createdAt: string;
  updatedAt: string;
}
