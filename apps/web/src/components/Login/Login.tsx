import React from "react";
import { useAuth } from "../../auth/AuthContext";
import { useAuthStore } from "../../store/useAuthStore";
import styles from "./Login.module.css"
import { useNavigate } from "react-router-dom";
import { AuthPage } from "../Auth/AuthPage";

export function Login() {

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthWindowOpen = useAuthStore((authWindow) => authWindow.isAuthWindowOpen)
  const setIsAuthWindowOpen = useAuthStore((authWindow) => authWindow.setIsAuthWindow)


  const redirectAfterLogout = () => {
      navigate("/")
   }

  return (
    <React.Fragment>
      {user ? (
        <div>
          <span>
            <button 
              className={styles.logoutButton} 
              onClick= {() => {
                logout()
                redirectAfterLogout()
             }}
             >
              Logout
            </button>
          </span>
        </div>
      ) : (
        <button className={styles.signinButton} onClick={() => {
          setIsAuthWindowOpen(true)
        }}>Signin</button>
      )}

      { isAuthWindowOpen && <AuthPage mode="inWindowAuth"/> }

    </React.Fragment>
  )
}