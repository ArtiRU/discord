import { currentProfile } from '@/lib/current-profile';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { FC } from 'react';

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage: FC<ServerIdPageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          name: 'general',
        },
      },
    },
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
      id: params.serverId,
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== 'general') {
    return null;
  }
  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
