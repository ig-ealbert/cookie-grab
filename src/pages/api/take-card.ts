import type { NextApiRequest, NextApiResponse } from 'next'
import { gameSingleton } from '@/lib/game';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {
  const requestBody = req.body;
  const player = requestBody.player;
  const pile = requestBody.pile;
  try {
    gameSingleton.playerTakesCard(player, pile);
    res.status(200).send(true);
  }
  catch {
    res.status(200).send(false);
  }
}