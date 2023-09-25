import { db } from '@/lib/db';

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return db.conversation.findFirst({
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
      where: {
        AND: [{ memberOneId, memberTwoId }],
      },
    });
  } catch (error) {
    console.log('FIND CONVERSATION ERROR', error);
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  try {
    return db.conversation.create({
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
      data: {
        memberTwoId,
        memberOneId,
      },
    });
  } catch (error) {
    console.log('CREATE CONVERSATION ERROR', error);
    return null;
  }
};

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberOneId, memberTwoId));

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return conversation;
};
