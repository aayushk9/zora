import { create } from "zustand";
import type { SelectedEventProps } from "../types/event";

type Store = {
    selectedEvents: SelectedEventProps[];
    addEvent: (event: SelectedEventProps) => void;
    removeEvent: (title: string) => void;
}

export const useEventStore = create<Store>((set) => ({
    selectedEvents: [],
    addEvent: (event) =>
        set((state) => {
            const alreadySelected = state.selectedEvents.find(e => e.title === event.title);
            if (alreadySelected) return state

            return {
                selectedEvents: [...state.selectedEvents, event]
            };
        }),
    removeEvent: (title) =>
        set((state) => ({
            selectedEvents: state.selectedEvents.filter(e => e.title !== title)
        }))
}))