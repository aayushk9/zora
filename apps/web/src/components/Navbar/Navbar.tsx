import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'
import React from 'react'
import { Login } from '../Login/Login'

export function Navbar() {

    return (
        <React.Fragment>
          <nav className={styles.navbar}>
             <Link className={styles.zora} to="/app"> Zora </Link>
            <div className={styles.navRight}>
              <Link className={styles.agents} to="/agents">Tools</Link> 
              <Login />
            </div>
          </nav>
        </React.Fragment>
    )
}