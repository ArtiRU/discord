import MobileToggle from '@/components/mobile-toggle';
import { Hash } from 'lucide-react';
import { FC } from 'react';

interface ChatHeaderProps {
  type: 'conversation' | 'channel';
  imageUrl?: string;
  serverId: string;
  name: string;
}

const ChatHeader: FC<ChatHeaderProps> = ({
  imageUrl,
  serverId,
  type,
  name,
}) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
    </div>
  );
};

export default ChatHeader;
