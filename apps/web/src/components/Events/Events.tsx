import React from "react"
import styles from './Events.module.css'

export function Events () {

    // we are supposed to fetch lots of things from here
    // search bar needs to search within existing evnts and return matching ones

    // how do we fetch events and display here
    // use side effect to fetch or send get request from events division from server

    // FETCH EVENTS ONLY ONCE AS THE COMPONENT MOUNTS I.E EMPTY DEPENDENCY []
    // FETCH -> GET -> RESPONSE -> PUT RESPONSE IN STATE -> DISPLAY STATE
    return (
        <React.Fragment>
          <div className={styles.container}>
             <span className={styles.discover}>Discover Polymarket Events</span>
             <div>
               <input className={styles.search} type="text" placeholder="Search events..."/>
               {/* CATEGORIES */}
               {/* SUB-CATEGORIES */}
             </div>
          </div>
        </React.Fragment>
    )
}