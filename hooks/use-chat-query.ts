import { useInfiniteQuery } from '@tanstack/react-query';
import useSocket from '@/hooks/use-socket';
import qs from 'query-string';

interface ChatQueryProps {
  paramKey: 'conversationId' | 'channelId';
  paramValue: string;
  queryKey: string;
  apiUrl: string;
}

const useChatQuery = ({
  paramValue,
  paramKey,
  queryKey,
  apiUrl,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        query: { [paramKey]: paramValue, cursor: pageParam },
        url: apiUrl,
      },
      { skipNull: true },
    );

    const res = await fetch(url);

    return res.json();
  };

  const { isFetchingNextPage, fetchNextPage, hasNextPage, status, data } =
    useInfiniteQuery({
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
      queryFn: fetchMessages,
      queryKey: [queryKey],
    });

  return { isFetchingNextPage, fetchNextPage, hasNextPage, status, data };
};

export default useChatQuery;
