import React from "react"
import styles from './EventCard.module.css'
import type { EventCardProps } from "../../types/event"

const formatVolumeUsd = (value: number) => {
  const format = (num: number, suffix: string) =>
    `$${num.toFixed(1).replace(/\.0$/, "")}${suffix}`;

  if (value >= 1e12) return format(value / 1e12, "T");
  if (value >= 1e9)  return format(value / 1e9, "B");
  if (value >= 1e6)  return format(value / 1e6, "M");
  if (value >= 1e3)  return format(value / 1e3, "K");
  return `$${Math.round(value)}`;
}

export function EventCard({ metaData, markets, totalVolume, isSelected, onClick}: EventCardProps) {
    const volumeUsd = totalVolume / 1e6;

     // YES% = buyYesPrice / (buyYesPrice + buyNoPrice) * 100

    return (
        <React.Fragment>
            <div onClick={onClick} className={`${styles.parentContainer} ${isSelected? styles.selectedEvent: ""}`}>
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
}