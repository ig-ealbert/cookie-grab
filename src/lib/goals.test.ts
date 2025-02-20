import assert from "assert";
import { describe, it } from "@jest/globals"
import { assignGoals, didAchieveGoal, findMatchingCards } from "./goals";

describe("Goals", () => {
  it("Did achieve goal for chocolate collector", () => {
    const didAchieve = didAchieveGoal("chocolate-collector", [
      "chocolate-chip", "chocolate-fudge", "chocolate-chip",
      "chocolate-fudge", "peanut-butter-chocolate",
      "creme-sandwich", "anything", "else", "is", "fine",
    ])
    assert.ok(didAchieve);
  });

  it("Did not achieve goal for chocolate collector", () => {
    const didAchieve = didAchieveGoal("chocolate-collector", [
      "sugar", "sugar", "frosted-sugar", "frosted-sugar",
      "holiday-tree", "meringue", "chocolate-chip",
      "creme-sandwich", "chocolate-chip", "chocolate-fudge",
    ])
    assert.ok(!didAchieve);
  });
  
  it("Did achieve goal for peanut butter collector", () => {
    const didAchieve = didAchieveGoal("peanut-butter-collector", [
      "peanut-butter", "peanut-butter", "peanut-butter-chocolate",
      "peanut-butter-chocolate", "any", "four", "other",
      "goals", "are", "fine",
    ])
    assert.ok(didAchieve);
  });

  it("Did not achieve goal for peanut butter collector", () => {
    const didAchieve = didAchieveGoal("peanut-butter-collector", [
      "sugar", "sugar", "frosted-sugar", "frosted-sugar",
      "holiday-tree", "meringue", "chocolate-chip",
      "creme-sandwich", "chocolate-chip", "chocolate-fudge",
    ])
    assert.ok(!didAchieve);
  });

  it("Did achieve goal for sugar collector", () => {
    const didAchieve = didAchieveGoal("sugar-collector", [
      "sugar-cookie", "sugar-cookie", "frosted-sugar",
      "frosted-sugar", "rest", "of", "goals", "do", "not", "matter"
    ])
    assert.ok(didAchieve);
  });

  it("Did not achieve goal for sugar collector", () => {
    const didAchieve = didAchieveGoal("sugar-collector", [
      "chocolate-chip", "holiday-tree", "frosted-sugar", "frosted-sugar",
      "holiday-tree", "meringue", "chocolate-chip",
      "creme-sandwich", "chocolate-chip", "chocolate-fudge",
    ])
    assert.ok(!didAchieve);
  });

  it("Did achieve goal for unique collector", () => {
    const didAchieve = didAchieveGoal("unique-collector", [
      "chocolate-chip", "chocolate-fudge", "peanut-butter",
      "holiday-tree", "peanut-butter-chocolate", "peanut-butter",
      "creme-sandwich", "creme-sandwich", "chocolate-chip", "holiday-tree",
    ])
    assert.ok(didAchieve);
  });

  it("Did not achieve goal for unique collector", () => {
    const didAchieve = didAchieveGoal("unique-collector", [
      "sugar", "sugar", "frosted-sugar", "frosted-sugar",
      "holiday-tree", "meringue", "chocolate-chip",
      "holiday-tree", "chocolate-chip", "meringue",
    ])
    assert.ok(!didAchieve);
  });

  it("Did achieve goal for same collector", () => {
    const didAchieve = didAchieveGoal("same-collector", [
      "chocolate-chip", "chocolate-fudge", "peanut-butter",
      "holiday-tree", "peanut-butter-chocolate", "peanut-butter",
      "creme-sandwich", "creme-sandwich", "chocolate-chip", "holiday-tree",
    ])
    assert.ok(didAchieve);
  });

  it("Did not achieve goal for same collector", () => {
    const didAchieve = didAchieveGoal("same-collector", [
      "sugar", "peanut-butter", "frosted-sugar", "peanut-butter-chocolate",
      "holiday-tree", "meringue", "chocolate-chip",
      "oatmeal-raisin", "chocolate-chip", "meringue",
    ])
    assert.ok(!didAchieve);
  });

  it("Chooses two different goals for each player", () => {
    const goals = assignGoals();
    assert.ok(goals[0][0] !== goals[0][1]);
    assert.ok(goals[1][0] !== goals[1][1]);
    assert.ok(goals[2][0] !== goals[2][1]);
    assert.ok(goals[3][0] !== goals[3][1]);
  });

  it("Correctly finds matching cards for chocolate collector", () => {
    const matchingCards = findMatchingCards("chocolate-collector", [
      "chocolate-chip", "chocolate-fudge", "chocolate-chip",
      "chocolate-fudge", "peanut-butter-chocolate",
      "creme-sandwich", "anything", "else", "is", "fine",
    ]);
    assert.ok(matchingCards.length === 6);
  });

  it("Correctly finds matching cards for peanut butter collector", () => {
    const matchingCards = findMatchingCards("peanut-butter-collector", [
      "peanut-butter", "peanut-butter", "peanut-butter-chocolate",
      "peanut-butter-chocolate", "any", "four", "other",
      "goals", "are", "fine",
    ]);
    assert.ok(matchingCards.length === 4);
  });

  it("Correctly finds matching cards for sugar collector", () => {
    const matchingCards = findMatchingCards("sugar-collector", [
      "sugar-cookie", "sugar-cookie", "frosted-sugar",
      "frosted-sugar", "rest", "of", "goals", "do", "not", "matter"
    ]);
    assert.ok(matchingCards.length === 4);
  });
});