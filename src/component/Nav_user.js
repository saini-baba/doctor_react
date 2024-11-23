import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import styles from "./nav_user.module.scss";

export const Nav_user = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Navigate to the home page
    navigate("/");
  };

  return (
    <nav className={` ${styles.navbar}`}>
      <div className={styles.navbar_logo}>
        <img src={`http://localhost:3001/logo.png`} alt="logo" />
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
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};
