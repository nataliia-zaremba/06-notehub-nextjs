import axios from "axios";
import type { Note, CreateNoteRequest } from "../types/note";
import toast from "react-hot-toast";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
if (!myKey) {
  toast.error("NEXT_PUBLIC_NOTEHUB_TOKEN is not defined");
  throw new Error("NEXT_PUBLIC_NOTEHUB_TOKEN is required");
}
axios.defaults.headers.common["Authorization"] = `Bearer ${myKey}`;

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  page: number;
  data: Note[];
  total_pages: number;
  perPage: number;
}

interface RawFetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  try {
    const response = await axios.get<RawFetchNotesResponse>("/notes", {
      params: {
        page,
        perPage,
        ...(search && { search }),
      },
    });

    const raw = response.data;

    return {
      page,
      perPage,
      data: raw.notes,
      total_pages: raw.totalPages,
    };
  } catch (error) {
    toast.error("Failed to fetch notes");
    throw error;
  }
};

export const createNote = async (note: CreateNoteRequest): Promise<Note> => {
  try {
    const response = await axios.post<Note>("/notes", note);
    toast.success("Note created successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to create note");
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const response = await axios.delete<Note>(`/notes/${id}`);
    toast.success("Note deleted successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to delete note");
    throw error;
  }
};

// Виправлена функція fetchNoteById
export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    // Виправлення 1: змінено тип параметра з number на string
    // Виправлення 2: API повертає об'єкт нотатки безпосередньо, без обгортання в "note"
    const response = await axios.get<Note>(`/notes/${id}`);
    return response.data; // замість response.data.note
  } catch (error) {
    toast.error("Failed to fetch note details");
    throw error;
  }
};
