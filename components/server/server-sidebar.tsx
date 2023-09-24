import { ShieldAlert, ShieldCheck, Video, Hash, Mic } from 'lucide-react';
import ServerMembersItem from '@/components/server/server-members-item';
import ServerSection from '@/components/server/server-section';
import ServerChannel from '@/components/server/server-channel';
import ServerHeader from '@/components/server/server-header';
import ServerSearch from '@/components/server/server-search';
import { ScrollArea } from '@/components/ui/scroll-area';
import { currentProfile } from '@/lib/current-profile';
import { Separator } from '@/components/ui/separator';
import { channel } from 'diagnostics_channel';
import { ChannelType } from '@prisma/client';
import { MemberRole } from '.prisma/client';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { FC } from 'react';

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  [MemberRole.GUEST]: null,
};

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
      <ScrollArea className="px-3 flex-1">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                data: textChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
                label: 'Text Channels',
                type: 'channel',
              },
              {
                data: audioChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
                label: 'Voice Channels',
                type: 'channel',
              },
              {
                data: videoChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
                label: 'Video Channels',
                type: 'channel',
              },
              {
                data: members?.map((member) => ({
                  icon: roleIconMap[member.role],
                  name: member.profile.name,
                  id: member.id,
                })),
                label: 'Members',
                type: 'member',
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              channelType={ChannelType.TEXT}
              sectionType="channels"
              label="Text Channels"
              role={role}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                channel={channel}
                key={channel.id}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              channelType={ChannelType.AUDIO}
              sectionType="channels"
              label="Voice Channels"
              role={role}
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                channel={channel}
                key={channel.id}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              channelType={ChannelType.VIDEO}
              sectionType="channels"
              label="Video Channels"
              role={role}
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                channel={channel}
                key={channel.id}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        <div className="md:hidden">
          {!!members?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="members"
                label="Members"
                server={server}
                role={role}
              />
              {members.map((member) => (
                <ServerMembersItem
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
