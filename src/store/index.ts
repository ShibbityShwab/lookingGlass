import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

interface Room {
  id: string;
  participants: User[];
  messages: Message[];
}

interface Store {
  roomId: string | null;
  username: string | null;
  isScreenSharing: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  setRoomId: (id: string) => void;
  setUsername: (username: string) => void;
  toggleScreenSharing: () => void;
  toggleCamera: () => void;
  toggleMic: () => void;
  addMessage: (message: Message) => void;
  addParticipant: (user: User) => void;
  removeParticipant: (userId: string) => void;
}

export const useStore = create<Store>((set) => ({
  roomId: null,
  username: null,
  isScreenSharing: false,
  isCameraOn: true,
  isMicOn: true,
  setRoomId: (id) => set({ roomId: id }),
  setUsername: (username) => set({ username }),
  toggleScreenSharing: () => set((state) => ({ isScreenSharing: !state.isScreenSharing })),
  toggleCamera: () => set((state) => ({ isCameraOn: !state.isCameraOn })),
  toggleMic: () => set((state) => ({ isMicOn: !state.isMicOn })),
  addMessage: (message) =>
    set((state) => ({
      messages: [...(state.messages || []), message],
    })),
  addParticipant: (user) =>
    set((state) => ({
      participants: [...(state.participants || []), user],
    })),
  removeParticipant: (userId) =>
    set((state) => ({
      participants: state.participants?.filter((p) => p.id !== userId) || [],
    })),
})); 