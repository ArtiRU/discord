import { create } from 'zustand';

export type ModalType = 'createServer';

interface ModalStore {
  onOpen: (type: ModalType) => void;
  type: ModalType | null;
  onClose: () => void;
  isOpen: boolean;
}

export const useModal = create<ModalStore>((set) => ({
  onClose: () => set({ isOpen: false, type: null }),
  onOpen: (type) => set({ isOpen: true, type }),
  isOpen: false,
  type: null,
}));
