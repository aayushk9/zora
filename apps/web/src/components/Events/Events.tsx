import React, { useEffect, useState } from "react"
import styles from './Events.module.css'
import clsx from "clsx"
import { EventCard } from "../EventCard/EventCard"
import type { EventCardProps } from "../../types/event"
import { useEventStore } from "../../store/useSelectedEventStore"

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
  const addEvent = useEventStore((s) => s.addEvent);
  const selectedEvents = useEventStore((s) => s.selectedEvents)
  const [events, setEvents] = useState<EventCardProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // send a request to /api/eventcategory as a post request with active category and request for
    // events with that active category 
    // for example if active catgeory is all send post request with body: active and backend return all catgery events
    // if active category changes send post request with that active category and backend return those category events

    const fetchEvents = async() => {
      try {
       const res = await fetch("https://prediction-market-api.jup.ag/api/v1/events") // GET Endpoint

       if(!res.ok) {
        throw new Error("failed to fetch events");
       }

       const jsonEvents = await res.json();
       const data = jsonEvents.data
       setEvents(data)
      } catch(err) {
        console.error(`err: ${err}`)
      } finally {
        setLoading(false)
      }
     }
     fetchEvents()
     // we need to fetch event data such as event imgUrl, event title, market titles, each markets yes % and no % 
     // for percent we will need to do some computation as we are going to have following data for each market
     /**  pricing": {
            "buyYesPriceUsd": 180000,
            "buyNoPriceUsd": 840000,
            "sellYesPriceUsd": 160000,
            "sellNoPriceUsd": 820000,
            "volume": 5870321,
            "volume24h": 118852,
            "openInterest": 4387443
          } **/ 
      // after having this data we need to do computation on this data and calculate yes and no %
  }, [])

  const searchForEvent = () => {
    // send searchinput to server through post request
  }

  // we are supposed to fetch lots of things from here
  // search bar needs to search within existing evnts and return matching ones

  // how do we fetch events and display here
  // use side effect to fetch or send get request from events division from server

  // send search data to backend (user i/p collected from frontend store it in state var and send to an api endpoint)

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

          {events.map((event) => (
             <EventCard 
              key={event.eventId}
              eventId={event.eventId}
              metaData={{
                title: event.metaData?.title || "",
                imgUrl: event.metaData?.imgUrl || ""
              }}
              totalVolume={event.totalVolume}
              isSelected={selectedEvents.some(e => e.title === event.metaData?.title)}
              onClick={() => {
               addEvent({
                imgUrl: event.metaData?.imgUrl || "",
                title: event.metaData?.title || "",
                totalVolume: event.totalVolume
               })
              }}
             />
            ))}
        </div>
        <div>
        </div>
      </div>
    </React.Fragment>
  )
}