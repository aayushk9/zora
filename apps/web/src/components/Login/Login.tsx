import React from "react";
import { useAuth } from "../../auth/AuthContext";
import { useAuthStore } from "../../store/useAuthStore";
import styles from "./Login.module.css"
import { useNavigate } from "react-router-dom";
import { AuthPage } from "../Auth/AuthPage";
import ProfileHeader from "../ProfileHeader/ProfileHeader";
import { useRef, useState, useEffect } from "react";

export function Login() {

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthWindowOpen = useAuthStore((authWindow) => authWindow.isAuthWindowOpen)
  const setIsAuthWindowOpen = useAuthStore((authWindow) => authWindow.setIsAuthWindow)
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <React.Fragment>
      {user ? (
        <div className={styles.profileContainer} ref={dropdownRef}>
          <button 
            className={styles.logoutButton} 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <ProfileHeader size="large" />
          </button>

          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <div className={styles.emailDisplay}>{user?.email}</div>
              <hr className={styles.divider} />
              <div className={styles.dropdownItem} onClick={handleLogout}>
                <span className={styles.logoutIcon}></span> Sign Out
              </div>
            </div>
          )}
        </div>
      ) : (
        <button className={styles.signinButton} onClick={() => {
          setIsAuthWindowOpen(true)
        }}>Sign In</button>
      )}

      { isAuthWindowOpen && <AuthPage/> }

    </React.Fragment>
  )
}