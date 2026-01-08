import React, { useState } from "react";
import styles from "./Login.module.css"

export const Login =  React.memo(function Login() {
  const [isLogged, setiSLogged] = useState(false);
  const [openLoginWindow, setOpenLoginWindow] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const signin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:3000/api/signin", {
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

      if (!res.ok) throw new Error("something is off")
      
      if(res.status == 200) setiSLogged(true)
      
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
      setOpenLoginWindow(false)
    }
  }
  return (
    <React.Fragment>
      {isLogged ? (
        <span className={styles.username}>
          {email}
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
                window.location.href = "http://localhost:3000/api/auth/google"
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
})