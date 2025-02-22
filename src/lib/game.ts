import { NUM_PLAYERS } from "./constants";
import { Deck } from "./deck";
import { assignGoals } from "./goals";
import { Pile } from "./pile";
import { Player } from "./player";

export class Game {
  private players: Player[] = [];
  private deck: Deck = new Deck();
  private piles: Pile[] = [];
  private eventLog: string[] = [];

  constructor() {
    const goalsForPlayers = assignGoals();
    for (let i = 0; i < NUM_PLAYERS; i++) {
      const player = new Player();
      player.addGoal(goalsForPlayers[i][0]);
      player.addGoal(goalsForPlayers[i][1]);
      this.players.push(player);
    }

    const dealtCards = this.deck.deal();
    for (let i = 0; i < NUM_PLAYERS; i++) {
      this.piles.push(new Pile(dealtCards[i]));
    }
  }

  getTopCardOfPiles() {
    return this.piles.map((pile: Pile) => pile.top());
  }

  getPileCounts() {
    return this.piles.map((pile: Pile) => pile.count());
  }

  areAllPilesEmpty() {
    for (const pile of this.piles) {
      if (pile.count() !== 0) {
        return false;
      }
    }
    return true;
  }

  playerTakesCard(player: number, pile: number) {
    const card = this.piles[pile].pop();
    if (!card) {
      throw Error('Cannot take card from empty pile');
    }
    this.players[player].addCardToHoard(card);
    this.eventLog.push(`Player ${player} takes ${card} from pile ${pile}`);
  }

  playerChooseMove(player: number) {
    const allCards = this.piles.map((pile) => pile.top());
    const cards = allCards.filter((card) => card !== "");
    if (player === 0) {
      throw new Error ("Player 0 is human and can make their own decisions!");
    }
    return this.players[player].chooseBestCard(cards);
  }

  getPlayerGoals(player: number) {
    return this.players[player].getGoals();
  }

  getPlayerHoard(player: number) {
    return this.players[player].getHoard();
  }

  getEventLog() {
    return this.eventLog;
  }

  scoreGame() {
    return this.players.map((player) => {
      return player.score();
    });
  }
}

export const gameSingleton = new Game();
