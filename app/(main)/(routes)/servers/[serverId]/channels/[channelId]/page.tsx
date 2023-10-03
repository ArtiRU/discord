import ChatMessages from '@/components/chat/chat-messages';
import { currentProfile } from '@/lib/current-profile';
import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import { redirectToSignIn } from '@clerk/nextjs';
import VideoRoom from '@/components/video-room';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { FC } from 'react';

interface ChannelIdPageProps {
  params: {
    channelId: string;
    serverId: string;
  };
}

const ChannelIdPage: FC<ChannelIdPageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    redirect('/');
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            socketQuery={{ serverId: channel.serverId, channelId: channel.id }}
            socketUrl="/api/socket/messages"
            paramValue={channel.id}
            apiUrl="/api/messages"
            paramKey="channelId"
            name={channel.name}
            chatId={channel.id}
            member={member}
            type="channel"
          />
          <ChatInput
            query={{
              serverId: channel.serverId,
              channelId: channel.id,
            }}
            apiUrl="/api/socket/messages"
            name={channel.name}
            type="channel"
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <VideoRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <VideoRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
