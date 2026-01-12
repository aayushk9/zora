import React, { useCallback } from "react"
import styles from './EventCard.module.css'
import type { EventCardProps } from "../../types/event"
import { formatVolumeUsd } from "../../hooks/useFormatVolumeUsd"

export const EventCard = React.memo(function EventCard({ metaData, markets, totalVolume, isSelected, onClick}: EventCardProps) {
    const volumeUsd = totalVolume / 1e6;

    const handleClick = useCallback(() => {
        if (onClick) {
            onClick({
                title: metaData?.title || "",
                totalVolume: totalVolume,
                marketCount: markets.length
            });
        }
    }, [onClick, metaData, markets.length, totalVolume]);
    
    return (
        <React.Fragment>
            <div onClick={handleClick} className={`${styles.parentContainer} ${isSelected? styles.selectedEvent: ""}`}>
                <div className={styles.header}>
                    <img src={metaData?.imgUrl} alt="event icon" className={styles.icon} />
                    <span className={styles.title}>{metaData?.title}</span>
                </div>

                <div className={styles.markets}>
                    {markets.map((market) => (
                        <div key={market.metaData?.title} className={styles.marketRow}>
                            <span className={styles.marketTitle}>{market.metaData?.title}</span>
                            <div className={styles.priceContainer}>
                                <span className={styles.yesPercent}>{market.pricing?.yesPercent ?? 0}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <span className={styles.volume}>{formatVolumeUsd(volumeUsd)} vol</span>
                </div>
            </div>
        </React.Fragment>
    )
})