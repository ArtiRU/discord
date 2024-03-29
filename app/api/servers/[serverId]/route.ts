import { currentProfile } from '@/lib/current-profile';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse('Server ID is missing', { status: 400 });
    }

    const server = await db.server.delete({
      where: {
        profileId: profile.id,
        id: params.serverId,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('SERVER ID DELETE', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    const { imageUrl, name } = await request.json();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse('Server ID is missing', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        profileId: profile.id,
        id: params.serverId,
      },
      data: {
        imageUrl,
        name,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('SERVER ID PATCH', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
