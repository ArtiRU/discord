'use client';

import { Message, Profile, Member } from '@prisma/client';
import ChatWelcome from '@/components/chat/chat-welcome';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { ElementRef, Fragment, useRef } from 'react';
import { ServerCrash, Loader2 } from 'lucide-react';
import ChatItem from '@/components/chat/chat-item';
import useChatQuery from '@/hooks/use-chat-query';
import { useScroll } from '@/hooks/use-scroll';
import { format } from 'date-fns';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

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

const ChatMessages = ({
  socketQuery,
  paramValue,
  socketUrl,
  paramKey,
  member,
  chatId,
  apiUrl,
  name,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const { isFetchingNextPage, fetchNextPage, hasNextPage, status, data } =
    useChatQuery({
      paramValue,
      queryKey,
      paramKey,
      apiUrl,
    });
  useChatSocket({ updateKey, queryKey, addKey });
  useScroll({
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
    loadMore: fetchNextPage,
    bottomRef,
    chatRef,
  });

  if (status === 'loading') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
              onClick={() => fetchNextPage()}
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
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
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
