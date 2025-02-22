import type { NextApiRequest, NextApiResponse } from 'next'
import { gameSingleton } from '@/lib/game';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<number[]>
) {
  const pileCounts = gameSingleton.getPileCounts();
  res.status(200).send(pileCounts);
}