import { create } from "zustand";

interface QuotaState {

  isExceeded: boolean;
  remaining: number;
  limit: number;
  resetAt: Date | null;
  message: string;
  isTemporary: boolean;

  setQuotaExceeded: (data: {
    used?: number;
    limit?: number;
    resetAt?: string;
    message: string;
    isTemporary?: boolean;
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
  isTemporary: false,

  setQuotaExceeded: (data) =>
    set({
      isExceeded: true,
      remaining: data.used !== undefined && data.limit !== undefined 
        ? data.limit - data.used 
        : 0,
      limit: data.limit ?? 1000,
      resetAt: data.resetAt ? new Date(data.resetAt) : null,
      message: data.message,
      isTemporary: data.isTemporary ?? false
    }),

  setQuotaData: (data) =>
    set({
      isExceeded: false,
      remaining: data.remaining,
      limit: data.limit,
      resetAt: new Date(data.resetAt),
      message: "",
      isTemporary: false, 
    }),

  resetQuota: () =>
    set({
      isExceeded: false,
      remaining: 10000,
      limit: 10000,
      resetAt: null,
      message: "",
      isTemporary: false,
    }),
}));