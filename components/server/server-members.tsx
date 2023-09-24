import ServerMembersItem from '@/components/server/server-members-item';
import ServerSection from '@/components/server/server-section';
import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { FC } from 'react';

interface ServerMembersProps {
  serverId: string;
}

const ServerMembers: FC<ServerMembersProps> = async ({ serverId }) => {
  const profile = await currentProfile();

  if (!profile) {
    redirect('/');
  }

  const server = await db.server.findUnique({
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    where: { id: serverId },
  });

  if (!server) {
    return redirect('/');
  }

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id,
  );

  const role = server.members.find((member) => member.profileId === profile.id)
    ?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <div className="p-3">
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              server={server}
              label="Members"
              role={role}
            />
            {members.map((member) => (
              <ServerMembersItem
                key={member.id}
                member={member}
                server={server}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerMembers;
