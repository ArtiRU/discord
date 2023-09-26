import { Message, Profile, Member } from '@prisma/client';

export type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
