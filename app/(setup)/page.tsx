import InitialModal from '@/components/modals/initial-modal';
import { initProfile } from '@/lib/init-profile';
import { redirect } from 'next/navigation';
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
  return <InitialModal />;
};

export default SetupPage;
