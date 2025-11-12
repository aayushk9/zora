type Outcome = {
    title: string;
    yesPercent: number;
    buyYesPriceUsd?: number;
    buyNoPriceUsd?: number
}

export type EventCardProps = {
    imgUrl: string;
    title: string;
    outcomes: Outcome[]
    totalVolume: number;
}