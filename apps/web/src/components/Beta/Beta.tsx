import React from "react";
import styles from './Beta.module.css'

export function Beta () {
    return (
       <React.Fragment>
           <div className={styles.container}>
              <span className={styles.beta}>Currently in beta</span>
           </div>
       </React.Fragment>
    )
}