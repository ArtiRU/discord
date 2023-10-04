import { NextApiResponseServerIo } from '@/types/server-types';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      // @ts-ignore
      cors: {
        origin: '*',
      },
      addTrailingSlash: false,
      path: path,
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
