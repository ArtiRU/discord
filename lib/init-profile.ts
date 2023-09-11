import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export const initProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
      userId: user.id,
    },
  });

  return newProfile;
};
