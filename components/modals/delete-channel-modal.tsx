'use client';

import {
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, FC } from 'react';
import qs from 'query-string';
import axios from 'axios';

const DeleteChannelModal: FC = () => {
  const { refresh, push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { onClose, isOpen, type, data } = useModal();
  const { channel, server } = data;

  const isModalOpen = isOpen && type === 'deleteChannel';

  const onLeave = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        query: {
          serverId: server?.id,
        },
        url: `/api/channels/${channel?.id}`,
      });

      await axios.delete(url);

      onClose();
      refresh();
      push(`/servers/${server?.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isModalOpen}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Are you sure you want to do this? <br />
            <span className="font-semibold text-indigo-500">
              #{channel?.name}
            </span>{' '}
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onLeave} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
