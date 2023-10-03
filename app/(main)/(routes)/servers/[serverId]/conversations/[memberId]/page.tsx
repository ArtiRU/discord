import { getOrCreateConversation } from '@/lib/conversation';
import ChatMessages from '@/components/chat/chat-messages';
import { currentProfile } from '@/lib/current-profile';
import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import { redirectToSignIn } from '@clerk/nextjs';
import VideoRoom from '@/components/video-room';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { FC } from 'react';

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage: FC<MemberIdPageProps> = async ({
  searchParams,
  params,
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect('/');
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId,
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberTwo, memberOne } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
      {searchParams.video && (
        <VideoRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            socketQuery={{
              conversationId: conversation.id,
            }}
            socketUrl="/api/socket/direct-messages"
            name={otherMember.profile.name}
            apiUrl="/api/direct-messages"
            paramValue={conversation.id}
            paramKey="conversationId"
            chatId={conversation.id}
            member={currentMember}
            type="conversation"
          />
          <ChatInput
            query={{
              conversationId: conversation.id,
            }}
            apiUrl="/api/socket/direct-messages"
            name={otherMember.profile.name}
            type="conversation"
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
