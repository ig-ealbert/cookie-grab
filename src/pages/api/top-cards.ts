import type { NextApiRequest, NextApiResponse } from 'next'
import { gameSingleton } from '@/lib/game';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  const visibleCards = gameSingleton.getTopCardOfPiles();
  res.status(200).send(visibleCards);
}