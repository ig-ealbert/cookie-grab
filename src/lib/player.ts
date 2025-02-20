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

    if ("unique-collector" === activeGoals[0] || "unique-collector" === activeGoals[1]) {
      goodPicks = goodPicks.concat(findUniqueCard(cards, this.hoard));
    }
    if ("same-collector" === activeGoals[0] || "same-collector" === activeGoals[1]) {
      goodPicks = goodPicks.concat(findSets(cards, this.hoard));
    }
    if (!goodPicks.length) {
      const randomNumber = Math.floor(Math.random() * cards.length);
      return cards[randomNumber];
    }
    else {
      const randomNumber = Math.floor(Math.random() * goodPicks.length);
      return goodPicks[randomNumber];
    }
  }

  getActiveGoals() {
    const activeGoals: string[] = [];
    const isActive1 = !didAchieveGoal(this.goals[0], this.hoard);
    const isActive2 = !didAchieveGoal(this.goals[1], this.hoard);
    if (isActive1) {
      activeGoals.push(this.goals[0]);
    }
    if (isActive2) {
      activeGoals.push(this.goals[1]);
    }
    return activeGoals;
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
