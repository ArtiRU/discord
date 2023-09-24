'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ReactNode, useEffect, useState, FC } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface ServerSearchProps {
  data: {
    data:
      | {
          icon: ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
    type: 'channel' | 'member';
    label: string;
  }[];
}

const ServerSearch: FC<ServerSearchProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const { push } = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
    };

    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keydown', down);
    };
  }, []);

  const onSelect = (type: 'channel' | 'member', id: string) => {
    setIsOpen(false);

    if (type === 'channel') {
      return push(`/servers/${params?.serverId}/conversations/${id}`);
    }

    if (type === 'member') {
      return push(`/servers/${params?.serverId}/members/${id}`);
    }
  };

  return (
    <>
      <button
        className="group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">CTRL</span> + K
        </kbd>
      </button>
      <CommandDialog onOpenChange={setIsOpen} open={isOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup heading={label} key={label}>
                {data?.map(({ icon, name, id }) => {
                  return (
                    <CommandItem onSelect={() => onSelect(type, id)} key={id}>
                      {icon} <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
