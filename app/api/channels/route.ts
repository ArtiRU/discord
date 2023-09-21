import { currentProfile } from '@/lib/current-profile';
import { MemberRole } from '.prisma/client';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await request.json();
    const { searchParams } = new URL(request.url);

    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server ID is missing', { status: 400 });
    }

    if (name === 'general') {
      return new NextResponse('Server cannot be "general"', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        members: {
          some: {
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
            profileId: profile.id,
          },
        },
        id: serverId,
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('CHANNEL ERROR', error);
    return new NextResponse('Intertal Error', { status: 500 });
  }
}
