import { didAchieveGoal, findMatchingCards, findSets, findUniqueCard } from "./goals";

export class Player {
  private goals: string[];
  private hoard: string[];

  constructor() {
    this.goals = [];
    this.hoard = [];
  }

  addGoal(goal: string) {
    this.goals.push(goal);
  }

  addCardToHoard(card: string) {
    this.hoard.push(card);
  }

  chooseBestCard(cards: string[]) {
    if (!cards.length) {
      throw new Error('no cards were passed to decision function');
    }
    if (cards.length === 1) {
      return cards[0];
    }
    const activeGoals = this.getActiveGoals();
    let goodPicks: string[] = [];
    if (activeGoals[0]) {
      const matches = findMatchingCards(activeGoals[0], cards);
      goodPicks = goodPicks.concat(matches);
    }
    if (activeGoals[1]) {
      const matches = findMatchingCards(activeGoals[1], cards);
      goodPicks = goodPicks.concat(matches);
    }

    if (activeGoals.includes("unique-collector")) {
      goodPicks = goodPicks.concat(findUniqueCard(cards, this.hoard));
    }
    if (activeGoals.includes("same-collector")) {
      goodPicks = goodPicks.concat(findSets(cards, this.hoard));
    }
    if (!goodPicks.length) {
      const randomNumber = Math.floor(Math.random() * cards.length);
      return cards[randomNumber];
    }
    else {
      const choices = Array.from(new Set(goodPicks)); // Remove duplicates
      const randomNumber = Math.floor(Math.random() * choices.length);
      return choices[randomNumber];
    }
  }

  getActiveGoals() {
    return this.goals.filter((goal) => !didAchieveGoal(goal, this.hoard));
  }

  getGoals() {
    return this.goals;
  }

  getHoard() {
    return this.hoard;
  }

  score() {
    let score = 0;
    score += didAchieveGoal(this.goals[0], this.hoard) ? 5 : 0;
    score += didAchieveGoal(this.goals[1], this.hoard) ? 5 : 0;
    return score;
  }
}
