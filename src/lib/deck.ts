import { cookies } from "./cookies";
import { NUM_PLAYERS } from "./constants";

export class Deck {
  private deck: string[];

  constructor() {
    this.deck = [];
    const available = [];
    
    // add cards to deck in order
    for (const cookieType in cookies) {
      for (let j = 0; j < NUM_PLAYERS; j++) {
          available.push(cookieType);
      }
    }

    // shuffle deck
    while (available.length > 0) {
      const choice = Math.floor(Math.random() * available.length);
      this.deck.push(available[choice]);
      available.splice(choice, 1); // delete the item
    }
  }

  deal() {
    const piles = [];
    const pileSize = this.deck.length / 4;
    for (let pile = 0; pile < 4; pile++) {
        // deal 1/4 of the deck into each pile
        piles.push(this.deck.slice(pile * pileSize, (pile + 1) * pileSize));
    }
    return piles;
  }
}
