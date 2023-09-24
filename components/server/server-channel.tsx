'use client';

import { ChannelType, MemberRole, Channel, Server } from '@prisma/client';
import { Trash, Video, Edit, Hash, Lock, Mic } from 'lucide-react';
import { ModalType, useModal } from '@/hooks/use-modal-store';
import ActionTooltip from '@/components/action-tooltip';
import { useParams, useRouter } from 'next/navigation';
import { MouseEvent, FC } from 'react';
import { cn } from '@/lib/utils';

interface ServerChannelProps {
  role?: MemberRole;
  channel: Channel;
  server: Server;
}

const iconMap = {
  [ChannelType.VIDEO]: Video,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.TEXT]: Hash,
};

const ServerChannel: FC<ServerChannelProps> = ({ channel, server, role }) => {
  const { onOpen } = useModal();
  const params = useParams();
  const { push } = useRouter();

  const onClick = () => {
    push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  const onAction = (e: MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  const Icon = iconMap[channel.type];
  return (
    <button
      className={cn(
        'group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700',
      )}
      onClick={onClick}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, 'editChannel')}
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => onAction(e, 'deleteChannel')}
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;
