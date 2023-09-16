import { AvatarImage, Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { FC } from 'react';

interface UserAvatarProps {
  className?: string;
  src?: string;
}

const UserAvatar: FC<UserAvatarProps> = ({ className, src }) => {
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};

export default UserAvatar;
