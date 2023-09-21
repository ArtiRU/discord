'use client';

import {
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
  FormItem,
  Form,
} from '@/components/ui/form';
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from '@/components/ui/select';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChannelType } from '@prisma/client';
import { useForm } from 'react-hook-form';
import qs from 'query-string';
import { FC } from 'react';
import axios from 'axios';
import { z } from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Server name is required.',
    })
    .refine((name) => name !== 'general', {
      message: 'Channel name cannot be "general"',
    }),
  type: z.nativeEnum(ChannelType),
});

const CreateChannelModal: FC = () => {
  const { onClose, isOpen, type } = useModal();
  const { refresh } = useRouter();
  const params = useParams();
  const form = useForm({
    defaultValues: {
      type: ChannelType.TEXT,
      name: '',
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;
  const isModalOpen = isOpen && type === 'createChannel';

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        query: {
          serverId: params?.serverId,
        },
        url: '/api/channels/',
      });

      await axios.post(url, values);

      form.reset();
      refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an imag. You can
            always change it later
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                render={({ field }) => (
                  <FormItem className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    <FormLabel>Channel name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="name"
              />
              <FormField
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            className="capitalize"
                            value={type}
                            key={type}
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
                name="type"
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
