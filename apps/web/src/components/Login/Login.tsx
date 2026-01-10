import React, { useState, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";
import styles from "./Login.module.css"

export function Login() {
  const { user, setUser, logout } = useAuth();
  const [openLoginWindow, setOpenLoginWindow] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

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
      console.log("userme: ", user)
      setUser(user);
      setOpenLoginWindow(false);
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }, [email, password])

  /*
    Google OAuth
    when user clicks on continue with google it should open google redirection page
    -> you save those details in same db -> check if same mail exists in db if no create user in db and generate jwt whereas if yes just generate jwt
    // signup -> logout when these request goes another request to chnage sttaus of user from null to somebody so signin turns logout

  */

    const handleGoogleLogin = () => {
      window.location.href ="http://localhost:3000/api/auth/google"
    }

  return (
    <React.Fragment>
      {user ? (
        <div>
          <span>
            <button className={styles.logoutButton} onClick={ () => {
              logout()
              setOpenLoginWindow(true)
             } }>Logout</button>
          </span>
        </div>
      ) : (
        <button className={styles.signinButton} onClick={() => {
          setOpenLoginWindow(true)
        }}>Signin</button>
      )}

      {openLoginWindow && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <span className={styles.signInHeader}>Sign in to get higher access limits</span>
              <button
                className={styles.close}
                onClick={() => setOpenLoginWindow(false)}
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