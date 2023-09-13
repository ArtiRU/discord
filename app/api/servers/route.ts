import { currentProfile } from '@/lib/current-profile';
import { MemberRole } from '.prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { imageUrl, name } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.create({
      data: {
        members: {
          create: [{ role: MemberRole.ADMIN, profileId: profile.id }],
        },
        channels: {
          create: [{ profileId: profile.id, name: 'general' }],
        },
        profileId: profile.id,
        inviteCode: uuidv4(),
        imageUrl,
        name,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log('Server post', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
