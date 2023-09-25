import { currentProfile } from '@/lib/current-profile';
import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import { redirectToSignIn } from '@clerk/nextjs';
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
      <div className="flex-1">Messages</div>
      <ChatInput
        query={{
          serverId: channel.serverId,
          channelId: channel.id,
        }}
        apiUrl="/api/socket/messages"
        name={channel.name}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
