import { redirectToSignIn, currentUser } from '@clerk/nextjs';
import { db } from '@/lib/db';

export const initProfile = async () => {
  try {
    const user = await currentUser();

    const fullName =
      user?.firstName &&
      user?.lastName &&
      `${user?.firstName} ${user?.lastName}`;

    const userName = user?.username;

    let displayName = null;

    if (fullName) {
      displayName = fullName;
    } else if (userName) {
      displayName = userName;
    } else {
      displayName =
        user?.emailAddresses.toString() ||
        `User ${user?.id.substr(0, user?.id.length / 2)}`;
    }

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
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
        name: displayName,
        userId: user.id,
      },
    });

    return newProfile;
  } catch (error) {
    console.log('Init profile error');
  }
};
