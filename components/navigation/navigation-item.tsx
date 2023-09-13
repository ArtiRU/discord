'use client';

import ActionTooltip from '@/components/action-tooltip';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FC } from 'react';

interface NavigationItemProps {
  imageUrl: string;
  name: string;
  id: string;
}

const NavigationItem: FC<NavigationItemProps> = ({ imageUrl, name, id }) => {
  const params = useParams();
  const { push } = useRouter();

  const onClick = () => {
    push(`/servers/${id}`);
  };
  return (
    <ActionTooltip align="center" side="right" label={name}>
      <button className="group relative flex items-center" onClick={onClick}>
        <div
          className={cn(
            'absolute, left-0 bg-primary rounded-full transition-all w-[4px]',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]',
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            params?.serverId === id &&
              'bg-primary/10 text-primary rounded-[16px]',
          )}
        >
          <Image src={imageUrl} alt="Channel" fill />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
