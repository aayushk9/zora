type Markets = {
    marketId?: string;
    metaData: {
        title: string;
    };
    pricing?: {
        buyYesPriceUsd: string
        buyNoPriceUsd: string
    }
} 

export type EventCardProps = {
    eventId: string;
    category?: string;
    metaData?: {
      imgUrl: string;
      title: string;
    }
    markets?: Markets[]
    totalVolume: string;
    isSelected?: boolean;
    onClick?: () => void;
}

export type SelectedEventProps = {
    imgUrl: string;
    title: string;
    totalVolume: number;
}