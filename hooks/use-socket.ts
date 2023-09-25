'use client';

import { SocketContext } from '@/providers/socket-provider';
import { useContext } from 'react';

const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;
