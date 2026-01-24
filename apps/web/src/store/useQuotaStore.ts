import { create } from "zustand";

interface QuotaState {
  isExceeded: boolean;
  remaining: number;
  limit: number;
  resetAt: Date | null;
  message: string;
  setQuotaExceeded: (data: {
    used: number;
    limit: number;
    resetAt: string;
    message: string;
  }) => void;
  setQuotaData: (data: {
    remaining: number;
    limit: number;
    resetAt: string;
  }) => void;
  resetQuota: () => void;
}

export const useQuotaStore = create<QuotaState>((set) => ({
  isExceeded: false,
  remaining: 10000,
  limit: 10000,
  resetAt: null,
  message: "",

  setQuotaExceeded: (data) =>
    set({
      isExceeded: true,
      remaining: 0,
      limit: data.limit,
      resetAt: new Date(data.resetAt),
      message: data.message,
    }),

  setQuotaData: (data) =>
    set({
      isExceeded: false,
      remaining: data.remaining,
      limit: data.limit,
      resetAt: new Date(data.resetAt),
      message: "",
    }),

  resetQuota: () =>
    set({
      isExceeded: false,
      remaining: 10000,
      limit: 10000,
      resetAt: null,
      message: "",
    }),
}));