import type { NextApiRequest, NextApiResponse } from 'next'
import { gameSingleton } from '@/lib/game';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  let playerParam = req.query.player;
  if (Array.isArray(playerParam)) {
    playerParam = playerParam[0];
  }
  if (!playerParam) {
    throw new Error("No player parameter was passed in the query");
  }
  const player = Number.parseInt(playerParam);
  const hoard = gameSingleton.getPlayerHoard(player);
  res.status(200).send(hoard);
}