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
import { zodResolver } from '@hookform/resolvers/zod';
import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { useEffect, useState, FC } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { z } from 'zod';

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Server image is required.',
  }),
  name: z.string().min(1, {
    message: 'Server name is required.',
  }),
});

const InitialModal: FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { refresh } = useRouter();
  const form = useForm({
    defaultValues: {
      imageUrl: '',
      name: '',
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/servers', values);

      form.reset();
      refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an imag. You can
            always change it later
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          onChange={field.onChange}
                          endpoint="serverImage"
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                  control={form.control}
                  name="imageUrl"
                ></FormField>
              </div>

              <FormField
                render={({ field }) => (
                  <FormItem className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    <FormLabel>Server name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
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

export default InitialModal;
