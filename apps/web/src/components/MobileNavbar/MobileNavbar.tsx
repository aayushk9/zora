import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./MobileNavbar.module.css";

export function MobileNavbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(prev => !prev);
  };

  const closeToggle = () => {
    setOpen(false);
  }

  return (
    <React.Fragment>
      <div className={styles.navbar}>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          ☰
        </div>

        <div className={styles.right}>
          
        </div>
      </div>

          {open && (
              <div className={styles.dropdownWrapper}>
                  <div className={styles.menuItems}>
                      <Link to="/query" className={styles.navItem}>Research</Link>
                      <Link to="/agents" className={styles.navItem}>Agents</Link>
                      <Link to="/query" className={styles.navItem}>History</Link>
                  </div>
                  <div className={styles.closeIcon} onClick={closeToggle}>
                      ✕
                  </div>
              </div>
          )}
      </React.Fragment>
  );
}
