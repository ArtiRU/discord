import { Profile, Member, Server } from '@prisma/client';
import { Server as SocketIoServer } from 'socket.io';
import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';

export type ServerWithMemberWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
};
