import type { NextApiRequest, NextApiResponse } from 'next'
import { gameSingleton } from '@/lib/game';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<number[]>
) {
  const score = gameSingleton.scoreGame();
  res.status(200).send(score);
}