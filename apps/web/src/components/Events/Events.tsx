import React, { useEffect, useState } from "react"
import styles from './Events.module.css'
import clsx from "clsx"

type Category = "all" | "crypto" | "sports" | "politics"

const categoryLabel: Record<Category, string> = {
  all: "All",
  crypto: "Crypto",
  sports: "Sports",
  politics: "Politics"
}

export function Events () {

  const [searchInput, setSearchInput] = useState("");
  const [active, setActive] = useState<Category>("all");

  useEffect(() => {
  // send a request to /api/eventcategory as a post request with active category and request for
  // events with that active category
  }, [active])
  
  const searchForEventFromDB = () => {
    // send searchinput to server throigh post request
  }
 
    // we are supposed to fetch lots of things from here
    // search bar needs to search within existing evnts and return matching ones

    // how do we fetch events and display here
    // use side effect to fetch or send get request from events division from server

    // FETCH EVENTS ONLY ONCE AS THE COMPONENT MOUNTS I.E EMPTY DEPENDENCY []
    // FETCH -> GET -> RESPONSE -> PUT RESPONSE IN STATE -> DISPLAY STATE

    // send search data to backend (user i/p collected from frontend store it in state var and send to an api endpoint)
    return (
        <React.Fragment>
          <div className={styles.container}>
             <span className={styles.header}>Discover Market Events</span>
             <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                 <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className={styles.search} type="text" placeholder="Search events..."/>
                <button className={styles.submit} onClick={searchForEventFromDB}>send</button>
              </div>
             </div>
          <div className={styles.eventCategories}>
            {Object.entries(categoryLabel).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setActive(value as Category)}
                className={clsx(styles.categoryButton, {
                  [styles.active]: active == value,
                })}
              >
                {label}
              </button>
            ))}
             </div>
          </div>
        </React.Fragment>
    )
}