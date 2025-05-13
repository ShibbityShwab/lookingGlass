import { NextApiRequest, NextApiResponse } from 'next';
import { addMessage, getMessages } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const { content, sender } = req.body;
      if (!content || !sender) {
        return res.status(400).json({ error: 'Content and sender are required' });
      }
      const message = await addMessage(id as string, content, sender);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create message' });
    }
  } else if (req.method === 'GET') {
    try {
      const messages = await getMessages(id as string);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 