'use client';

import { ShieldAlert, ShieldCheck, FileIcon, Trash, Edit } from 'lucide-react';
import { FormControl, FormField, FormItem, Form } from '@/components/ui/form';
import ActionTooltip from '@/components/action-tooltip';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '@/hooks/use-modal-store';
import UserAvatar from '@/components/user-avatar';
import { Profile, Member } from '@prisma/client';
import { useEffect, useState, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MemberRole } from '.prisma/client';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import qs from 'query-string';
import axios from 'axios';
import * as z from 'zod';

interface ChatItemProps {
  member: Member & {
    profile: Profile;
  };
  socketQuery: Record<string, string>;
  fileUrl: string | null;
  currentMember: Member;
  isUpdated: boolean;
  timestamp: string;
  socketUrl: string;
  deleted: boolean;
  content: string;
  id: string;
}

const roleIconMap = {
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
  GUEST: null,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem: FC<ChatItemProps> = ({
  currentMember,
  socketQuery,
  socketUrl,
  timestamp,
  isUpdated,
  fileUrl,
  deleted,
  content,
  member,
  id,
}) => {
  const params = useParams();
  const { push } = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content,
    },
    resolver: zodResolver(formSchema),
  });

  const [isEditing, setIsEditing] = useState(false);

  const fileType = fileUrl?.split('.').pop();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const isPdf = fileType === 'pdf' && fileUrl;
  const isImage = !isPdf && fileUrl;
  const isLoading = form.formState.isSubmitting;

  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;

  const { onOpen } = useModal();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  useEffect(() => {
    form.reset({
      content,
    });
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          className="cursor-pointer hover:drop-shadow-md transition"
          onClick={onMemberClick}
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className="font-semibold text-sm hover:underline cursor-pointer"
                onClick={onMemberClick}
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                <p>{roleIconMap[member.role]}</p>
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              className="relative aspect-square rounded-md mt-2 overflow-hidden
              border flex items-center bg-secondary h-48 w-48"
              rel="noopener noreferrer"
              target="_blank"
              href={fileUrl}
            >
              <Image
                className="object-cover"
                src={fileUrl}
                alt={content}
                fill
              />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
                href={fileUrl}
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted &&
                  'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1',
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gapx-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75
                          border-none border-0 focus-visible:ring-0
                          focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                  control={form.control}
                  name="content"
                />
                <Button
                  disabled={isLoading}
                  variant="primary"
                  className="ml-3"
                  size="sm"
                >
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div
          className="hidden group-hover:flex items-center gap-x-2 absolute 
        p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm"
        >
          {canDeleteMessage && (
            <ActionTooltip label="Edit">
              <Edit
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500
              hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen('deleteMessage', {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500
              hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
