import NavigationSidebar from '@/components/navigation/navigation-sidebar';
import { SheetContent, SheetTrigger, Sheet } from '@/components/ui/sheet';
import ServerSidebar from '@/components/server/server-sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { FC } from 'react';

const MobileToggle: FC<{ serverId: string }> = ({ serverId }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 flex gap-0" side="left">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
