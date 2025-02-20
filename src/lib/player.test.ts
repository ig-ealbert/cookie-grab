import assert from "assert";
import { describe, it } from "@jest/globals"
import { Player } from "./player";

describe("Player", () => {
  it("Add goal", () => {
    const player = new Player();
    player.addGoal("goal1");
    const goals = player.getGoals();
    assert.ok(goals[0] === "goal1");
    assert.ok(goals.length === 1);
  });

  it("Add card to hoard", () => {
    const player = new Player();
    player.addCardToHoard("card1");
    const cards = player.getHoard();
    assert.ok(cards[0] === "card1");
    assert.ok(cards.length === 1);
  });
  
  it("Choose best card with no cards", () => {
    const player = new Player();
    assert.throws(() => player.chooseBestCard([]));
  });

  it("Choose best card with one card", () => {
    const player = new Player();
    const chosen = player.chooseBestCard(["one card"]);
    assert.ok(chosen === "one card");
  });

  it("Choose best card with multiple cards", () => {
    const player = new Player();
    player.addGoal("chocolate-collector");
    const chosen = player.chooseBestCard(["chocolate-chip", "sugar-cookie"]);
    assert.ok(chosen === "chocolate-chip");
  });

  it("Get active goals", () => {
    const player = new Player();
    player.addGoal("chocolate-collector");
    player.addGoal("sugar-collector");
    player.addCardToHoard("sugar-cookie");
    player.addCardToHoard("sugar-cookie");
    player.addCardToHoard("frosted-sugar");
    player.addCardToHoard("frosted-sugar");
    const active = player.getActiveGoals();
    assert.ok(active.length === 1);
    assert.ok(active[0] === "chocolate-collector");
  });

  it("Score", () => {
    const player = new Player();
    player.addGoal("chocolate-collector");
    player.addGoal("sugar-collector");
    player.addCardToHoard("sugar-cookie");
    player.addCardToHoard("sugar-cookie");
    player.addCardToHoard("frosted-sugar");
    player.addCardToHoard("frosted-sugar");
    const score = player.score();
    assert.ok(score === 5);
  });
});