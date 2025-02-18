import type { NextApiRequest, NextApiResponse } from 'next'
import { gameSingleton } from '@/lib/game';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  const goals = gameSingleton.getPlayerGoals(0);
  res.status(200).send(goals);
}