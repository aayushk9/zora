import React from "react"
import styles from './EventCard.module.css'
import type { EventCardProps } from "../../types/event"

export function EventCard({ metaData, markets, totalVolume, isSelected, onClick}: EventCardProps) {
    return (
        <React.Fragment>
            <div onClick={onClick} className={`${styles.parentContainer} ${isSelected? styles.selectedEvent: ""}`}>
                <div className={styles.header}>
                    <img src={metaData?.imgUrl} alt="event icon" className={styles.icon} />
                    <span className={styles.title}>{metaData?.title}</span>
                </div>

                <div className={styles.outcomes}>
                    {markets.map((market) => (
                        <div key={market.metaData?.title} className={styles.outcomeRow}>
                            <span className={styles.outcomeTitle}>{market.metaData?.title}</span>
                            <div className={styles.priceContainer}>
                                <span className={styles.yesPercent}>{market.pricing?.buyYesPriceUsd}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <span className={styles.volume}>${Number(totalVolume).toLocaleString()} vo</span>
                </div>
            </div>
        </React.Fragment>
    )
}