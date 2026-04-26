import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ChatMode = "chat" | "mind";

interface ChatModeStore {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  toggleMode: () => void;
}

export const useChatModeStore = create<ChatModeStore>()(
  persist(
    (set, get) => ({
      mode: "chat",
      setMode: (mode: ChatMode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === "chat" ? "mind" : "chat" }),
    }),
    {
      name: "chat-mode-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
