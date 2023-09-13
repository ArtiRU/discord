import NavigationAction from '@/components/navigation/navigation-action';
import NavigationItem from '@/components/navigation/navigation-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { currentProfile } from '@/lib/current-profile';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { FC } from 'react';

const NavigationSidebar: FC = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <aside className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div className="mb-4" key={server.id}>
            <NavigationItem
              imageUrl={server.imageUrl}
              name={server.name}
              id={server.id}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          appearance={{ elements: { avatarBox: 'h-[48px] w-[48px]' } }}
          afterSignOutUrl="/"
        />
      </div>
    </aside>
  );
};

export default NavigationSidebar;