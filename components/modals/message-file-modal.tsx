'use client';
import {
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '@/hooks/use-modal-store';
import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import qs from 'query-string';
import { FC } from 'react';
import axios from 'axios';
import { z } from 'zod';

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: 'Attachments is required.',
  }),
});

const MessageFileModal: FC = () => {
  const { refresh } = useRouter();
  const { onClose, isOpen, type, data } = useModal();
  const { apiUrl, query } = data;
  const form = useForm({
    defaultValues: {
      fileUrl: '',
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;
  const isModalOpen = isOpen && type === 'messageFile';

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      });

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });

      refresh();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog onOpenChange={handleClose} open={isModalOpen}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add a attachments
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as message
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
                          endpoint="messageFile"
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                  control={form.control}
                  name="fileUrl"
                ></FormField>
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
