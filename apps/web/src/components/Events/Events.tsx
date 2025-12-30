import React, { useEffect, useState } from "react"
import styles from './Events.module.css'
import clsx from "clsx"
import { EventCard } from "../EventCard/EventCard"
import type { EventCardProps } from "../../types/event"
import { useEventStore } from "../../store/useSelectedEventStore"
import { EventSkeleton } from "../EventSkeleton/EventSkeleton"

type Category = "all" | "crypto" | "sports" | "politics"

const categoryLabel: Record<Category, string> = {
  all: "All",
  crypto: "Crypto",
  sports: "Sports",
  politics: "Politics"
}

export function Events() {

  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const addEvent = useEventStore((s) => s.addEvent);
  const selectedEvents = useEventStore((s) => s.selectedEvents)
  const [events, setEvents] = useState<EventCardProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // send a request to /api/eventcategory as a post request with active category and request for
    // events with that active category 
    // for example if active catgeory is all send post request with body: active and backend return all catgery events
    // if active category changes send post request with that active category and backend return those category events

    const fetchEvents = async () => {
      const calcYesPercent = (yes: number, no: number) => {
        if (!yes && !no) return 0;
        return Math.round((yes / (yes + no)) * 100)
      }

      try {
        const res = await fetch("https://prediction-market-api.jup.ag/api/v1/events") 

        if (!res.ok) {
          throw new Error("failed to fetch events");
        }

        const eventsInJSON = await res.json();
        const data: EventCardProps[] = eventsInJSON.data.map((event: any) => ({
          metaData: {
            title: event.metadata?.title || "",
            imgUrl: event.metadata?.imageUrl || ""
          },
          totalVolume: event.volumeUsd || 0,
          markets: event.markets?.map((market: any) => ({
            metaData: {
              title: market.metadata?.title || ""
            },
            pricing: {
              buyYesPriceUsd: market.pricing?.buyYesPriceUsd || 0, 
              buyNoPriceUsd: market.pricing?.buyNoPriceUsd || 0,
              yesPercent: calcYesPercent(
                market.pricing?.buyYesPriceUsd,
                market.pricing?.buyNoPriceUsd
              ),
            }
          }))
        }))
        console.log(data)
        setEvents(data)
      } catch (err) {
        console.error(`err: ${err}`)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
   // initially its all so no chnage needed when category chnages send request to api and fetch events from selected category
   // make a comparison with activeCategory and categories which match push them inside event state and display
   const fetchSelectedCategoryEvents = async () => {
    
   }
   fetchSelectedCategoryEvents();
  }, [activeCategory])

  const searchForEvent = () => {
    // send searchinput to server through post request
  }

  return (
    <React.Fragment>
      <div className={styles.container}>
        <span className={styles.header}>Discover Live Market Events</span>
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
              onClick={() => setActiveCategory(value as Category)}
              className={clsx(styles.categoryButton, {
                [styles.active]: activeCategory == value,
              })}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.eventsGrid}>

          {loading ?
            Array.from({ length: 6 }).map((_, i) => (
              <EventSkeleton key={i} />
            ))
            :
            events.map((event, index) => (
              <EventCard
                key={index}
                metaData={{
                  title: event.metaData?.title || "",
                  imgUrl: event.metaData?.imgUrl || ""
                }}
                markets={event.markets}
                totalVolume={event.totalVolume}
                isSelected={selectedEvents.some(e => e.title === event.metaData?.title)}
                onClick={() => {
                  addEvent({
                    imgUrl: event.metaData?.imgUrl || "",
                    title: event.metaData?.title || "",
                    totalVolume: event.totalVolume,
                    marketCount: event.markets?.length || 0
                  })
                }}
              />
            ))
          }
        </div>
        <div>
        </div>
      </div>
    </React.Fragment>
  )
}