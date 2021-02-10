import React from "react";
import styles from "./header.module.css";

const Header: React.FC = ({ children }) => {
  return (
    <header className={styles.header}>
      <h1>{children}</h1>
    </header>
  );
};

export default Header;
