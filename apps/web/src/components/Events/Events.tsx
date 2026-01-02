import React, { useCallback, useEffect, useState } from "react"
import styles from './Events.module.css'
import { EventCard } from "../EventCard/EventCard"
import type { EventCardProps, SelectedEventProps, Category } from "../../types/event"
import { useEventStore } from "../../store/useSelectedEventStore"
import { EventSkeleton } from "../EventSkeleton/EventSkeleton"

export function Events() {

  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const addEvent = useEventStore((s) => s.addEvent);
  const selectedEvents = useEventStore((s) => s.selectedEvents)
  const [events, setEvents] = useState<EventCardProps[]>([])
  const [loading, setLoading] = useState(true)

  const categories: Record<Category, string> = {
    all: "All",
    crypto: "Crypto",
    sports: "Sports",
    politics: "Politics",
    esports: "Esports",
    culture: "Culture",
    economics: "Economics",
    tech: "Tech"
  }

  useEffect(() => {
    const fetchEvents = async () => {
      const calcYesPercent = (yes: number, no: number) => {
        if (!yes && !no) return 0;
        return Math.round((yes / (yes + no)) * 100)
      }

      try {
        const res = await fetch(`https://prediction-market-api.jup.ag/api/v1/events?category=${activeCategory}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })

        if (!res.ok) {
          throw new Error("failed to fetch events");
        }

        const eventsInJSON = await res.json();
        const data: EventCardProps[] = eventsInJSON.data.map((event: any) => ({
          metaData: {
            title: event.metadata?.title || "",
            imgUrl: event.metadata?.imageUrl || ""
          },
          category: event.category,
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
        
        setEvents(data)
        console.log(data)
      } catch (err) {
        console.log(`err: ${err}`)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [activeCategory])

  const searchForEvent = () => {
    let filteredEvent: EventCardProps[] = []
    const normalizedSearchInput = searchInput.trim().toLowerCase()
    events.filter((event) => event.metaData?.title.toLowerCase().includes(normalizedSearchInput) && (
      filteredEvent.push(event)
    ))
    setEvents(filteredEvent)
  }

  const addEvents = useCallback((event: SelectedEventProps) => {
    addEvent({
      imgUrl: event.imgUrl,
      title: event.title,
      totalVolume: event.totalVolume,
      marketCount: event.marketCount
    })
  }, [addEvent])

  const emptySearchInput = searchInput.trim() === ""

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
              tabIndex={0}
              onKeyDown={(e) => {
               if(e.key == "Enter") {
                  searchForEvent()
               }
              }}
              className={styles.search}
              type="text"
              placeholder="Search events..."
            />

            <button 
            className={styles.rightBtn} 
            onClick={searchForEvent}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>

          </div>
        </div>

        <div className={styles.eventCategories}>
        
          {Object.entries(categories).map(([value, category]) => (
            <button
              key={value}
              onClick={() => {
                setActiveCategory(value as Category)
                setLoading(true)
              }}
              className={`${activeCategory == value ? styles.active : styles.categoryButton}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.eventsGrid}>

          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <EventSkeleton key={i} />
            ))
          }

          {events.length > 0  ? events.map((event) => (
            <EventCard
              key={event.metaData?.title}
              metaData={{
                title: event.metaData?.title || "",
                imgUrl: event.metaData?.imgUrl || ""
              }}
              markets={event.markets}
              totalVolume={event.totalVolume}
              isSelected={selectedEvents.some(e => e.title === event.metaData?.title)}
              onClick={addEvents}
            />
          )) :
            <p className={styles.noEvent}>No event found</p>
          }
        </div>
        <div>
        </div>
      </div>
    </React.Fragment>
  )
}