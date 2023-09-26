'use client';

import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from '@/components/ui/popover';
import Picker from '@emoji-mart/react';
import { useTheme } from 'next-themes';
import { Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import { FC } from 'react';

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ onChange }) => {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
      </PopoverTrigger>
      <PopoverContent
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
        sideOffset={40}
        side="right"
      >
        <Picker
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          theme={resolvedTheme}
          data={data}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
