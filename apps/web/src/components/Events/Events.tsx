import React, { useEffect, useState } from "react"
import styles from './Events.module.css'
import clsx from "clsx"
import { EventCard } from "../EventCard/EventCard"
//import type { EventCardProps } from "../../types/event"


type Category = "all" | "crypto" | "sports" | "politics"

const categoryLabel: Record<Category, string> = {
  all: "All",
  crypto: "Crypto",
  sports: "Sports",
  politics: "Politics"
}

export function Events() {

  const [searchInput, setSearchInput] = useState("");
  const [active, setActive] = useState<Category>("all");
  //const [events, setEvents] = useState<EventCardProps[]>([])

  useEffect(() => {
    // send a request to /api/eventcategory as a post request with active category and request for
    // events with that active category 
    // for example if active catgeory is all send post request with body: active and backend return all catgery events
    // if active category changes send post request with that active category and backend return those category events
  }, [active])

  const searchForEvent = () => {
    // send searchinput to server throigh post request
  }

  // we are supposed to fetch lots of things from here
  // search bar needs to search within existing evnts and return matching ones

  // how do we fetch events and display here
  // use side effect to fetch or send get request from events division from server

  // FETCH EVENTS ONLY ONCE AS THE COMPONENT MOUNTS I.E EMPTY DEPENDENCY []
  // FETCH -> GET -> RESPONSE -> PUT RESPONSE IN STATE -> DISPLAY STATE

  // send search data to backend (user i/p collected from frontend store it in state var and send to an api endpoint)

  // events will be coming from backend for that we need to create event card component which should accept 
  // certain props ie whatever resposne coming from backend such as imgyrl, title, description, options, etc
  // style that box in certain manner and import that card component here 
  // at frontend those props == state 
  // such as prop imgurl = state imgurl
  // setImageURL(res.data.imgURL)
  return (
    <React.Fragment>
      <div className={styles.container}>
        <span className={styles.header}>Discover Market Events</span>
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <div className={styles.leftIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.search}
              type="text"
              placeholder="Search events..."
            />

            <button className={styles.rightBtn} onClick={searchForEvent}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
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

        <div className={styles.eventsGrid}>
          <EventCard
            imgUrl="https://kalshi-public-docs.s3.amazonaws.com/series-images-webp/KXEPLGAME.webp"
            title="Burnley vs Chelsea"

            outcomes={[
              { title: "Chelsea", yesPercent: 65 },
              { title: "Tie", yesPercent: 22 },
              { title: "Burnley", yesPercent: 16 }
            ]}
            totalVolume={25772}
            />

             <EventCard
              imgUrl="https://kalshi-public-docs.s3.amazonaws.com/series-images-webp/KXEPLGAME.webp"
              title="Burnley vs Chelsea"
              outcomes={[
                { title: "Chelsea", yesPercent: 65 },
                { title: "Tie", yesPercent: 22 },
                { title: "Burnley", yesPercent: 16 }
              ]}
              totalVolume={25772}
            />

             <EventCard
              imgUrl="https://kalshi-public-docs.s3.amazonaws.com/series-images-webp/KXEPLGAME.webp"
              title="Burnley vs Chelsea"
              outcomes={[
                { title: "Chelsea", yesPercent: 65 },
                { title: "Tie", yesPercent: 22 },
                { title: "Burnley", yesPercent: 16 }
              ]}
              totalVolume={25772}
            />

             <EventCard
              imgUrl="https://kalshi-public-docs.s3.amazonaws.com/series-images-webp/KXEPLGAME.webp"
              title="Burnley vs Chelsea"
              outcomes={[
                { title: "Chelsea", yesPercent: 65 },
                { title: "Tie", yesPercent: 22 },
                { title: "Burnley", yesPercent: 16 }
              ]}
              totalVolume={25772}
            />

             <EventCard
              imgUrl="https://kalshi-public-docs.s3.amazonaws.com/series-images-webp/KXEPLGAME.webp"
              title="Burnley vs Chelsea"
              outcomes={[
                { title: "Chelsea", yesPercent: 65 },
                { title: "Tie", yesPercent: 22 },
                { title: "Burnley", yesPercent: 16 }
              ]}
              totalVolume={25772}
            />
        </div>
      </div>
    </React.Fragment>
  )
}