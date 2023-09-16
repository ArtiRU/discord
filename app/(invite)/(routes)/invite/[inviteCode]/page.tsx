import { currentProfile } from '@/lib/current-profile';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { FC } from 'react';

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage: FC<InviteCodePageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect('/');
  }

  const existingServer = await db.server.findFirst({
    where: {
      members: { some: { profileId: profile.id } },
      inviteCode: params.inviteCode,
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
    where: { inviteCode: params.inviteCode },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;
