import ServerHeader from '@/components/server/server-header';
import { currentProfile } from '@/lib/current-profile';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { FC } from 'react';

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar: FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }

  const server = await db.server.findUnique({
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    where: { id: serverId },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id,
  );
  if (!server) {
    return redirect('/');
  }

  const role = server.members.find((member) => member.profileId === profile.id)
    ?.role;
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
