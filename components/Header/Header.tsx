import React from "react";
import Link from "next/link"; // <--- Імпортуємо Link для навігації в Next.js
import css from "./Header.module.css";

const Header = () => {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home" className={css.logo}>
        {" "}
        {/* Використовуємо Link */}
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link> {/* Використовуємо Link */}
          </li>
          <li>
            <Link href="/notes">Notes</Link> {/* Використовуємо Link */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
