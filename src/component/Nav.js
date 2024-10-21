import React, { useState } from "react";
import styles from "./nav.module.scss";

export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src="logo.png" alt="logo" />
      </div>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`}></div>
      </div>
      <ul className={`${styles.nav_links} ${isOpen ? styles.open : ""}`}>
        <li>
          <a href="/">Login</a>
        </li>
      </ul>
    </nav>
  );
};
