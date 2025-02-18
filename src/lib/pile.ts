import { cookies } from "./cookies";

export class Pile {
  private cardsInPile: string[];

  constructor(cards: string[]) {
    this.cardsInPile = cards;
  }

  count() {
    return this.cardsInPile.length;
  }

  top() {
    return this.cardsInPile[this.cardsInPile.length - 1];
  }

  pop() {
    return this.cardsInPile.pop();
  }
}
