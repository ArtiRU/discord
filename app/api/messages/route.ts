import { currentProfile } from '@/lib/current-profile';
import { NextResponse } from 'next/server';
import { Message } from '@prisma/client';
import { db } from '@/lib/db';

const MESSAGES_BATCH = 20;

export async function GET(request: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get('cursor');
    const channelId = searchParams.get('channelId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!channelId) {
      return new NextResponse('Channel ID is missing', { status: 400 });
    }
    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        take: MESSAGES_BATCH,
        skip: 1,
      });
    } else {
      messages = await db.message.findMany({
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          channelId,
        },
        take: MESSAGES_BATCH,
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log('MESSAGES ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
