type Markets = {
    metaData?: {
        title: string;
    };
    pricing?: {
        buyYesPriceUsd?: number;
        buyNoPriceUsd?: number;
        yesPercent: number;
    }
} 

export type EventCardProps = {
    metaData?: {
      imgUrl: string;
      title: string;
    }
    markets: Markets[];
    totalVolume: number;
    isSelected?: boolean;
    onClick?: (events: SelectedEventProps) => void;
}

export type SelectedEventProps = {
    imgUrl: string;
    title: string;
    totalVolume: number;
    marketCount: number;
}