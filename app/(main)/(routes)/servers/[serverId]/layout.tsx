import ServerSidebar from '@/components/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ReactNode, FC } from 'react';
import { db } from '@/lib/db';

interface ServerIdLayoutProps {
  params: { serverId: string };
  children: ReactNode;
}

const ServerIdLayout: FC<ServerIdLayoutProps> = async ({
  children,
  params,
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
      id: params.serverId,
    },
  });

  if (!server) {
    return redirect('/');
  }
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed">
        <ServerSidebar serverId={server.id} />
      </div>
      <div className="h-full md:pl-60">{children}</div>
    </div>
  );
};

export default ServerIdLayout;
