'use client';

import { FormControl, FormField, FormItem, Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import EmojiPicker from '@/components/emoji-picker';
import { useModal } from '@/hooks/use-modal-store';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import qs from 'query-string';
import { FC } from 'react';
import axios from 'axios';
import * as z from 'zod';

interface ChatInputProps {
  type: 'conversation' | 'channel';
  query: Record<string, any>;
  apiUrl: string;
  name: string;
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput: FC<ChatInputProps> = ({ apiUrl, query, type, name }) => {
  const { onOpen } = useModal();
  const { refresh } = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);

      form.reset();
      refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition p-1 rounded-full flex items-center justify-center"
                    onClick={() => onOpen('messageFile', { apiUrl, query })}
                    type="button"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:right-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    disabled={isLoading}
                    {...field}
                    placeholder={`Message ${
                      type === 'conversation' ? name : '#' + name
                    }`}
                    autoComplete="off"
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
          control={form.control}
          name="content"
        />
      </form>
    </Form>
  );
};

export default ChatInput;
