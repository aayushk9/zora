import React, { useState } from "react";
import styles from "./Login.module.css"

export function Login() {
  const [isLogged, setiSLogged] = useState(false);
  const [openLoginWindow, setOpenLoginWindow] = useState(false)
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const signin = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName,
          password
        }),
        credentials: "include"
      })

      if (!res.ok) {
        throw new Error("something is off")
      }
      // after succesfull fetch set logged state to true
    } catch (err) {
      console.log(err)
    } finally {
      setiSLogged(true)
    }
  }
  return (
    <React.Fragment>
      {isLogged ? (
        <span className={styles.username}>
          {userName}
        </span>
      ) : (
        <button className={styles.signinButton} onClick={() => {
          setOpenLoginWindow(true)
        }}>Signin</button>
      )}

      {openLoginWindow && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <span className={styles.signInHeader}>Sign in</span>
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

              <form className={styles.signinForm} onSubmit={signin}>
                <input
                  type="text"
                  placeholder="aayushk@gmail.com"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={styles.input}
                />

                <input
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                />

                <button type="submit" className={styles.signinBtn}>
                  Sign in
                </button>
              </form>

              <div className={styles.divider} />

              <button className={styles.googleBtn}>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}