'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from '@/components/ui/dialog';
import { RefreshCw, Check, Copy } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { useOrigin } from '@/hooks/use-origin';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState, FC } from 'react';
import axios from 'axios';

const InviteServerModal: FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { onClose, isOpen, onOpen, type, data } = useModal();
  const origin = useOrigin();
  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const isModalOpen = isOpen && type === 'invite';

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const onNewLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`,
      );

      onOpen('invite', { server: response.data });
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
            Invite friends!
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              disabled={isLoading}
              value={inviteUrl}
            />
            <Button disabled={isLoading} size="icon">
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" onClick={onCopy} />
              )}
            </Button>
          </div>
          <Button
            className="text-xs text-zinc-500 mt-4"
            disabled={isLoading}
            onClick={onNewLink}
            variant="link"
            size="sm"
          >
            Generate a new link
            <RefreshCw className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteServerModal;
