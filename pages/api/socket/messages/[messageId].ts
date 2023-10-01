import { currentProfilePages } from '@/lib/current-profile-pages';
import { NextApiResponseServerIo } from '@/types/server-types';
import { MemberRole } from '@prisma/client';
import { NextApiRequest } from 'next';
import { db } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await currentProfilePages(req);
    const { messageId, channelId, serverId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!serverId) {
      return res.status(400).json({ error: 'Server ID is missing' });
    }

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID is missing' });
    }

    const server = await db.server.findFirst({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
        id: serverId as string,
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const channel = await db.channel.findFirst({
      where: {
        serverId: serverId as string,
        id: channelId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    let message = await db.message.findFirst({
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      where: {
        channelId: channelId as string,
        id: messageId as string,
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'DELETE') {
      message = await db.message.update({
        data: {
          content: 'This message has been deleted.',
          fileUrl: null,
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        where: {
          id: messageId as string,
        },
      });
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      message = await db.message.update({
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log('MESSAGE ID', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
