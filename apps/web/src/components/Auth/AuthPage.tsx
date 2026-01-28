import React, { useState, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useAuthStore } from "../../store/useAuthStore";
import styles from "./Auth.module.css"
import { API_BASE_URL } from "../../env";
import zora from "../../assets/zora.png";

interface authModel {
  mode: "inWindowAuth" | "landingPage"
}

export function AuthPage({ mode }: authModel) {

  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const setIsAuthWindowOpen = useAuthStore((authWindow) => authWindow.setIsAuthWindow)

  const signin = useCallback(async (e: React.FormEvent) => {

    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth`, {
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

      const me = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      const user = await me.json();
      setUser(user)
      setIsAuthWindowOpen(false)
    
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
      
    }
  }, [email, password])

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`
  }

  const AuthContent = (
    <div className={`${mode == "inWindowAuth" ? styles.authContainer : styles.landingAuthContainer}`} style={{ "--zora": `url(${zora})` } as React.CSSProperties} >
      <div className={styles.lhs}>
        <div className={styles.lhsContent}>
          <div className={styles.brandTop}>
            <span className={styles.brandIcon}>▲</span> ZORA
          </div>
          <h1 className={`${mode == "landingPage" ? styles.heroText : styles.heroForAuth}`}>
            The intelligence layer <br />
            for prediction markets.
          </h1>
          <p className={styles.heroSubtext}>
            Analyze trends and optimize your positions with AI-driven insights.
          </p>
        </div>
      </div>
    
      {mode == "inWindowAuth" && (
        <div className={styles.rhs}>
          <div className={styles.formWrapper}>
            <div className={styles.headerText}>
              <h2>Welcome to Zora</h2>
              <p>Sign in to your account</p>
            </div>

            <button onClick={handleGoogleLogin} className={styles.googleBtnLarge}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              Continue with Google
            </button>

            <div className={styles.orDivider}>
              <span>or sign in with email</span>
            </div>

            <form className={styles.signinForm} onSubmit={signin}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
              <button
                type="submit"
                className={isLoading ? styles.loadingBtn : styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );


  if (mode == "inWindowAuth") {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={() => setIsAuthWindowOpen(false)}>✕</button>
          {AuthContent}
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.pageWrapper}>
        {AuthContent}
      </div>
    )
  }
}