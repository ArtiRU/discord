'use client';

import { MessageWithMemberWithProfile } from '@/types/chat-types';
import ChatWelcome from '@/components/chat/chat-welcome';
import { ServerCrash, Loader2 } from 'lucide-react';
import ChatItem from '@/components/chat/chat-item';
import useChatQuery from '@/hooks/use-chat-query';
import { Member } from '@prisma/client';
import { Fragment, FC } from 'react';
import { format } from 'date-fns';

interface ChatMessagesProps {
  paramKey: 'conversationId' | 'channelId';
  socketQuery: Record<string, string>;
  type: 'conversation' | 'channel';
  paramValue: string;
  socketUrl: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  name: string;
}

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

const ChatMessages: FC<ChatMessagesProps> = ({
  socketQuery,
  paramValue,
  socketUrl,
  paramKey,
  chatId,
  apiUrl,
  member,
  name,
  type,
}) => {
  const queryKey = `chat:${chatId}`;
  const { isFetchingNextPage, fetchNextPage, hasNextPage, status, data } =
    useChatQuery({ paramValue, paramKey, queryKey, apiUrl });

  if (status === 'loading') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin mt-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 mt-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                socketQuery={socketQuery}
                member={message.member}
                currentMember={member}
                socketUrl={socketUrl}
                key={message.id}
                id={message.id}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;