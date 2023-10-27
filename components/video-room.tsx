'use client';

import { VideoConference, LiveKitRoom } from '@livekit/components-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, FC } from 'react';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import '@livekit/components-styles';

interface VideoRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

const VideoRoom: FC<VideoRoomProps> = ({ chatId, video, audio }) => {
  const [token, setToken] = useState('');
  const { user } = useUser();
  const { push } = useRouter();
  const params = useParams();

  useEffect(() => {
    const name = `${user?.firstName} ${user?.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`,
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [chatId, user?.lastName, user?.firstName]);

  const onDisconnect = () => {
    push(`/servers/${params?.serverId}`);
  };

  if (token === '') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onDisconnected={onDisconnect}
      data-lk-theme="default"
      connect={true}
      token={token}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default VideoRoom;
1;
