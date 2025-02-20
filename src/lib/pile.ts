export class Pile {
  private cardsInPile: string[];

  constructor(cards: string[]) {
    this.cardsInPile = cards;
  }

  count() {
    return this.cardsInPile.length;
  }

  top() {
    if (this.cardsInPile.length < 1) {
      return "";
    }
    return this.cardsInPile[this.cardsInPile.length - 1];
  }

  pop() {
    return this.cardsInPile.pop();
  }
}
