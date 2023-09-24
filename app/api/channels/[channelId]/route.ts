import { currentProfile } from '@/lib/current-profile';
import { MemberRole } from '.prisma/client';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server ID is Missing', { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse('Channel ID is Missing', { status: 400 });
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
          delete: {
            name: {
              not: 'general',
            },
            id: params.channelId,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('CHANNEL ID DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(request.url);
    const { name, type } = await request.json();
    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server ID is Missing', { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse('Channel ID is Missing', { status: 400 });
    }

    if (name === 'general') {
      return new NextResponse('Name cannot be "general"', { status: 400 });
    }

    const server = await db.server.update({
      data: {
        channels: {
          update: {
            where: {
              NOT: {
                name: 'general',
              },
              id: params.channelId,
            },
            data: {
              name,
              type,
            },
          },
        },
      },
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
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('CHANNEL PATCH ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
