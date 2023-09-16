'use client';

import {
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenu,
} from '@/components/ui/dropdown-menu';
import {
  ShieldQuestion,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  Shield,
  Check,
  Gavel,
} from 'lucide-react';
import {
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from '@/components/ui/dialog';
import { ServerWithMemberWithProfiles } from '@/types/server-types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useModal } from '@/hooks/use-modal-store';
import UserAvatar from '@/components/user-avatar';
import { MemberRole } from '.prisma/client';
import { useRouter } from 'next/navigation';
import { useState, FC } from 'react';
import qs from 'query-string';
import axios from 'axios';

const roleIconMap = {
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
  GUEST: null,
};

const MembersModal: FC = () => {
  const [loadingId, setLoadingId] = useState('');
  const { refresh } = useRouter();
  const { onClose, isOpen, onOpen, type, data } = useModal();
  const { server } = data as { server: ServerWithMemberWithProfiles };

  const isModalOpen = isOpen && type === 'members';

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        query: {
          serverId: server?.id,
        },
        url: `/api/members/${memberId}`,
      });

      const response = await axios.patch(url, { role });
      refresh();
      onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        query: {
          serverId: server?.id,
        },
        url: `/api/members/${memberId}`,
      });

      const response = await axios.delete(url);
      refresh();

      onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isModalOpen}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div className="flex items-center gap-x-2 mb-6" key={member.id}>
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinx-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, 'GUEST')}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === 'GUEST' && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, 'MODERATOR')
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === 'MODERATOR' && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator className="" />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
