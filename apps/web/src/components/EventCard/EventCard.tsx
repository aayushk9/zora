import React from "react"
import styles from './EventCard.module.css'
import type { EventCardProps } from "../../types/event"

export function EventCard({ imgUrl, title, outcomes, totalVolume, isSelected, onClick}: EventCardProps) {
    return (
        <React.Fragment>
            <div onClick={onClick} className={`${styles.parentContainer} ${isSelected? styles.selectedEvent: ""}`}>
                <div className={styles.header}>
                    <img src={imgUrl} alt="event icon" className={styles.icon} />
                    <span className={styles.title}>{title}</span>
                </div>

                <div className={styles.outcomes}>
                    {outcomes.map((outcome) => (
                        <div key={outcome.title} className={styles.outcomeRow}>
                            <span className={styles.outcomeTitle}>{outcome.title}</span>
                            <div className={styles.priceContainer}>
                                <span className={styles.yesPercent}>{outcome.yesPercent}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <span className={styles.volume}>${totalVolume.toLocaleString()} vol</span>
                </div>
            </div>
        </React.Fragment>
    )
}