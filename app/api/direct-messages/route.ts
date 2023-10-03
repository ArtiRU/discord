import { currentProfile } from '@/lib/current-profile';
import { DirectMessage } from '@prisma/client';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MESSAGES_BATCH = 20;

export async function GET(request: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get('cursor');
    const conversationId = searchParams.get('conversationId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse('conversation ID is missing', { status: 400 });
    }
    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
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
          conversationId,
        },
        cursor: {
          id: cursor,
        },
        take: MESSAGES_BATCH,
        skip: 1,
      });
    } else {
      messages = await db.directMessage.findMany({
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
          conversationId,
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
    console.log('DIRECT MESSAGES ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
