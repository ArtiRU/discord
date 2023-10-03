'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import ActionTooltip from '@/components/action-tooltip';
import { VideoOff, Video } from 'lucide-react';
import qs from 'query-string';
import { FC } from 'react';

const ChatVideoButton: FC = () => {
  const searchParams = useSearchParams();
  const isVideo = searchParams?.get('video');
  const pathname = usePathname();
  const { push } = useRouter();

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? 'End video call' : 'Start video call';

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        query: {
          video: isVideo ? undefined : true,
        },
        url: pathname || '',
      },
      { skipNull: true },
    );

    push(url);
  };
  return (
    <ActionTooltip label={tooltipLabel} side="bottom">
      <button className="hover:opacity-75 transition mr-4" onClick={onClick}>
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
