import { redirectToSignIn, currentUser } from '@clerk/nextjs';
import { db } from '@/lib/db';

export const initProfile = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return redirectToSignIn();
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
  } catch (error) {
    console.log('Init profile error');
  }
};
