import React, { useState } from "react";
import styles from "./nav_user.module.scss";
export const Nav_user = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className={` ${styles.navbar}`}>
      <div className={styles.navbar_logo}>
        <img src="logo.png" alt="logo" />
      </div>
      <div className={styles.heading}>
        <h1>Welcome</h1>
      </div>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.open : ""}`}></div>
      </div>
      <ul className={`${styles.nav_links} ${isOpen ? styles.open : ""}`}>
        <li>
          <button>Logout</button>
        </li>
      </ul>
    </nav>
  );
};
