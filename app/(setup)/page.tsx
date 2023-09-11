import { initProfile } from '@/lib/init-profile';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { FC } from 'react';

const SetupPage: FC = async () => {
  const profile = await initProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return (
    <div>
      <div>Create a server</div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default SetupPage;
