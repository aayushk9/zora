import React, { useState, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useAuthStore } from "../../store/useAuthStore";
import styles from "./Login.module.css"

export function Login() {
  const { user, setUser, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const isAuthWindowOpen = useAuthStore((authWindow) => authWindow.isAuthWindowOpen);
  const setIsAuthWindowOpen = useAuthStore((authWindow) => authWindow.setIsAuthWindow)

  const signin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:3000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        }),
        credentials: "include"
      })

      if (res.status == 401) {
        alert("Invalid credentials")
      }

      const me = await fetch("http://localhost:3000/api/auth/me", { // extract user details from jwt
        credentials: "include",
      });

      const user = await me.json();
      setUser(user);
      setIsAuthWindowOpen(false);
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }, [email, password])

    const handleGoogleLogin = () => {
      window.location.href ="http://localhost:3000/api/auth/google"
    }

    const redirectAfterLogout = () => {
      window.location.href = "http://localhost:5173"
    }

  return (
    <React.Fragment>
      {user ? (
        <div>
          <span>
            <button className={styles.logoutButton} onClick={ () => {
              logout()
              setIsAuthWindowOpen(true)
              redirectAfterLogout()
             } }>Logout</button>
          </span>
        </div>
      ) : (
        <button className={styles.signinButton} onClick={() => {
          setIsAuthWindowOpen(true)
        }}>Signin</button>
      )}

      {isAuthWindowOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <span className={styles.signInHeader}>Sign in</span>
              <button
                className={styles.close}
                onClick={() => setIsAuthWindowOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.body}>
              <div className={styles.logo}>Zora</div>
              <p className={styles.subtitle}>
                Suggestion layer for prediction markets
              </p>

              <form
                className={styles.signinForm}
                onSubmit={signin}
              >
                <input
                  type="text"
                  placeholder="aayushk@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />

                <input
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                />

                <button type="submit" className={`${isLoading ? styles.loadingSignup : styles.signupButton}`}>
                  Sign in
                </button>

              </form>

              <div className={styles.divider} />

              <button
                onClick={() => {
                 handleGoogleLogin()
                }}
                className={styles.googleBtn}>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}