import { NUM_PLAYERS } from "./constants";
import { GoalInfo } from "./types/goal-info";

export const goals: Record<string, GoalInfo> = {
  "chocolate-collector": {
    image: "images/goal-chocolate-collector.png",
    matches: ["chocolate-chip", "chocolate-fudge",
              "peanut-butter-chocolate", "creme-sandwich"],
    requiredCount: NUM_PLAYERS * 2,
    tooltip: "Chocolate Collector (2 * number of players)",
  },
  "peanut-butter-collector": {
    image: "images/goal-peanut-butter-collector.png",
    matches: ["peanut-butter-chocolate", "peanut-butter"],
    requiredCount: NUM_PLAYERS,
    tooltip: "Peanut Butter Collector (number of players)",
  },
  "sugar-collector": {
    image: "images/goal-sugar-collector.png",
    matches: ["sugar-cookie", "frosted-sugar"],
    requiredCount: NUM_PLAYERS,
    tooltip: "Sugar Collector (number of players)",
  },
  "unique-collector": {
    image: "images/goal-unique-collector.png",
    requiredCount: 7,
    tooltip: "Unique Collector (7)",
  },
  "same-collector": {
    image: "images/goal-same-collector.png",
    requiredCount: 3,
    tooltip: "Same Collector (3 pairs)",
  },
};

export function didAchieveGoal(goal: string, cards: string[]) {
  if (["chocolate-collector", "peanut-butter-collector", "sugar-collector"].includes(goal)) {
    let count = 0;
    for (let card of cards) {
      if(goals[goal]?.matches?.includes(card)) {
        count++;
      }
    }
    return count >= goals[goal].requiredCount;
  }
  else if (goal === "unique-collector") {
    const uniqueSet = new Set(cards)
    return uniqueSet.size >= goals[goal].requiredCount;
  }
  else if (goal === "same-collector") {
    const validSets: string[] = [];
    for (const card of cards) {
      const first = cards.indexOf(card);
      const last = cards.lastIndexOf(card);
      if (first !== last && !validSets.includes(card)) {
        validSets.push(card);
      }
    }
    return validSets.length >= goals[goal].requiredCount;
  }
  return false;
}

export function assignGoals() {
  const goalList = Object.keys(goals);
  const available = goalList.slice().concat(goalList.slice());
  const theGoals = [];
  for (let i = 0; i < NUM_PLAYERS; i++) {
    theGoals.push(chooseTwoDifferentGoals(available));
  }
  return theGoals;
}

function chooseTwoDifferentGoals(available: string[]) {
  const choice1 = Math.floor(Math.random() * available.length);
  const goal1 = available[choice1];
  available.splice(choice1, 1);
  let goal2 = goal1;
  let choice2 = -1;
  while (goal2 === goal1) {
    choice2 = Math.floor(Math.random() * available.length);
    goal2 = available[choice2];
  }
  available.splice(choice2, 1);
  return [goal1, goal2];
}
