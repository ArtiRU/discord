'use client';

import { Profile, Member, Server } from '@prisma/client';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import UserAvatar from '@/components/user-avatar';
import { MemberRole } from '.prisma/client';
import { cn } from '@/lib/utils';
import { FC } from 'react';

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
  [MemberRole.GUEST]: null,
};

const ServerMembersItem: FC<ServerMemberProps> = ({ member, server }) => {
  const params = useParams();
  const { push } = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };
  return (
    <button
      className={cn(
        'group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700',
      )}
      onClick={onClick}
    >
      <UserAvatar
        className="h-8 w-8 md:h-8 md:w-8 "
        src={member.profile.imageUrl}
      />
      <p
        className={cn(
          'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.memberId === member.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMembersItem;
