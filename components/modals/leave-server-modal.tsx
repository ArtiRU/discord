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
import axios from 'axios';

const LeaveServerModal: FC = () => {
  const { refresh, push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { onClose, isOpen, type, data } = useModal();
  const { server } = data;

  const isModalOpen = isOpen && type === 'leaveServer';

  const onLeave = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      refresh();
      push('/');
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
            Leave {`"${server?.name}"`}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Are you sure you want to leave{' '}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
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

export default LeaveServerModal;
