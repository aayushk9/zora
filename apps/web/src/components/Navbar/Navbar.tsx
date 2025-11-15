import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'
import React from 'react'

export function Navbar() {

    return (
        <React.Fragment>
          <nav className={styles.navbar}>
            <div> <Link className={styles.zora} to="/"> Zora </Link></div>
            <div className={styles.navRight}>
              <Link className={styles.agents} to="/agents">Tools</Link>
              <Link className={styles.signin} to="/">Sign in</Link>
            </div>
          </nav>
        </React.Fragment>
    )
}