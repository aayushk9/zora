import styles from './Navbar.module.css'
import React from 'react'

export function Navbar() {

    return (
        <React.Fragment>
          <div className={styles.parentContainer}>
            <span className={styles.zora}>Zora</span>
            <button className={styles.signin}>Sign in</button>
          </div>
        </React.Fragment>
    )
}