'use client';

import CreateChannelModal from '@/components/modals/create-channel-modal';
import CreateServerModal from '@/components/modals/create-server-modal';
import InviteServerModal from '@/components/modals/invite-server-modal';
import LeaveServerModal from '@/components/modals/leave-server-modal';
import EditServerModal from '@/components/modals/edit-server-modal';
import MembersModal from '@/components/modals/members-modal';
import { useEffect, useState, FC } from 'react';

const ModalProvider: FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteServerModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
    </>
  );
};

export default ModalProvider;
