import { didAchieveGoal } from "./goals";

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
