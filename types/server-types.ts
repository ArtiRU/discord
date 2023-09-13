import { Profile, Member, Server } from '@prisma/client';

export type ServerWithMemberWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
