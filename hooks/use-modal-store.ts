import { ChannelType, Channel, Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalType =
  | 'createChannel'
  | 'deleteChannel'
  | 'createServer'
  | 'deleteServer'
  | 'leaveServer'
  | 'editChannel'
  | 'editServer'
  | 'members'
  | 'invite';

interface ModalData {
  channelType?: ChannelType;
  channel?: Channel;
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
