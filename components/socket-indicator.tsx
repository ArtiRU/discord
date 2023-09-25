'use client';

import { Badge } from '@/components/ui/badge';
import useSocket from '@/hooks/use-socket';
import { FC } from 'react';

const SocketIndicator: FC = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge className="bg-yellow-600 text-white border-none" variant="outline">
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge className="bg-emerald-600 text-white border-none" variant="outline">
      Live: Real-time updates
    </Badge>
  );
};

export default SocketIndicator;
