import { currentProfile } from '@/lib/current-profile';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { memberId: string } },
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

    if (!params.memberId) {
      return new NextResponse('Member ID is Missing', { status: 400 });
    }

    const server = await db.server.update({
      data: {
        members: {
          deleteMany: {
            profileId: {
              not: profile.id,
            },
            id: params.memberId,
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
      where: { profileId: profile.id, id: serverId },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('DELETE ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(request.url);
    const { role } = await request.json();
    const serverId = searchParams.get('serverId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!serverId) {
      return new NextResponse('Server ID is Missing', { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse('Member ID is Missing', { status: 400 });
    }

    const server = await db.server.update({
      data: {
        members: {
          update: {
            where: {
              profileId: {
                not: profile.id,
              },
              id: params.memberId,
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          orderBy: {
            role: 'asc',
          },
          include: { profile: true },
        },
      },
      where: { profileId: profile.id, id: serverId },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('Member error', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
