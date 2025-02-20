import assert from "assert";
import { describe, it } from "@jest/globals"
import { Pile } from "./pile";

describe("Pile", () => {
  it("Count", () => {
    const pile = new Pile(["one card", "two card"]);
    const count = pile.count();
    assert.ok(count === 2);
  });

  it("Top", () => {
    const pile = new Pile(["one card", "two card"]);
    const top = pile.top();
    assert.ok(top === "two card");
  });
  
  it("Pop", () => {
    const pile = new Pile(["one card", "two card"]);
    const poppedCard = pile.pop();
    assert.ok(poppedCard === "two card");
    assert.ok(pile.top() === "one card");
    assert.ok(pile.count() === 1);
  });
});