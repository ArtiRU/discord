import { Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalType =
  | 'createChannel'
  | 'createServer'
  | 'leaveServer'
  | 'editServer'
  | 'members'
  | 'invite';

interface ModalData {
  server?: Server;
}

interface ModalStore {
  onOpen: (type: ModalType, data?: ModalData) => void;
  type: ModalType | null;
  onClose: () => void;
  isOpen: boolean;
  data: ModalData;
}

export const useModal = create<ModalStore>((set) => ({
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
  isOpen: false,
  type: null,
  data: {},
}));
