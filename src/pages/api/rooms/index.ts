import { NextApiRequest, NextApiResponse } from 'next';
import { createRoom, getRoom } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const roomId = uuidv4();
      const room = await createRoom(roomId);
      res.status(201).json(room);
    } catch (error) {
      console.error('Failed to create room:', error);
      res.status(500).json({ error: 'Failed to create room' });
    }
  } else if (req.method === 'GET') {
    try {
      const { id } = req.query;
      if (typeof id === 'string') {
        const room = await getRoom(id);
        if (!room) {
          return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json(room);
      } else {
        res.status(400).json({ error: 'Invalid room ID' });
      }
    } catch (error) {
      console.error('Failed to fetch room:', error);
      res.status(500).json({ error: 'Failed to fetch room' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 