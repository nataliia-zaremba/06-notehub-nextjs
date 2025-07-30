import axios from "axios";
import type { Note, CreateNoteRequest } from "../types/note";
import toast from "react-hot-toast";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const myApiKey = `Bearer ${myKey}`;
axios.defaults.headers.common["Authorization"] = myApiKey;

if (!myKey) {
  toast.error("NEXT_PUBLIC_NOTEHUB_TOKEN is not defined");
  throw new Error("NEXT_PUBLIC_NOTEHUB_TOKEN is required");
}

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

interface CreateNoteResponse {
  note: Note;
}

interface DeleteNoteResponse {
  note: Note;
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
        ...(search !== "" && { search: search }),
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
    const response = await axios.post<CreateNoteResponse>("/notes", note);
    toast.success("Note created successfully");
    return response.data.note;
  } catch (error) {
    toast.error("Failed to create note");
    throw error;
  }
};

export const deleteNote = async (id: number): Promise<Note> => {
  try {
    const response = await axios.delete<DeleteNoteResponse>(`/notes/${id}`);
    toast.success("Note deleted successfully");
    return response.data.note;
  } catch (error) {
    toast.error("Failed to delete note");
    throw error;
  }
};

export const fetchNoteById = async (id: number): Promise<Note> => {
  try {
    const response = await axios.get<{ note: Note }>(`/notes/${id}`);
    return response.data.note;
  } catch (error) {
    toast.error("Failed to fetch note details");
    throw error;
  }
};
