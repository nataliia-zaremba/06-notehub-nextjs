"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import NoteList from "../../components/NoteList/NoteList";
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import NoteModal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import { fetchNotes } from "../../lib/api";
import css from "./NotesPage.module.css";
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const NotesClient: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: notesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearchTerm],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage,
        search: debouncedSearchTerm,
      }),
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNoteCreated = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading notes</div>;

  const notes = notesData?.data || [];
  const totalPages = notesData?.total_pages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        <button onClick={handleOpenModal} className={css.button}>
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}

      <NoteModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NoteForm onSuccess={handleNoteCreated} onCancel={handleCloseModal} />
      </NoteModal>
    </div>
  );
};

export default NotesClient;
