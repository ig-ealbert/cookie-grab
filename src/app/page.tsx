'use client';

import { useState, useEffect } from "react";
import { cookies } from "@/lib/cookies";
import { TURN_DELAY } from "@/lib/constants";
import { goals } from "@/lib/goals";
import styles from "./page.module.css";

export default function Home() {
  const [playerTurn, setPlayerTurn] = useState<number>(0);
  useEffect(() => {
    if (playerTurn !== 0) {
      handleAIMove(playerTurn);
    }
  }, [playerTurn]);

  const [topCards, setTopCards] = useState<string[]>([]);
  useEffect(() => {
    getTopCards();
  }, []);

  const [allGoals, setAllGoals] = useState<string[][]>([]);
  useEffect(() => {    
    initializeGoals() 
  }, []);

  const [eventLog, setEventLog] = useState<string[]>([]);
  useEffect(() => scrollToBottomOfLog(), [eventLog]);

  const [myHoard, setMyHoard] = useState<string[]>([]);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  function scrollToBottomOfLog() {
    const log = document.getElementById("log");
    if (log) {
      log.scrollTop = log.scrollHeight;
    }
  }

  function checkForEndGame(cards: string[]) {
    if (!cards[0] && !cards[1] &&
      !cards[2] && !cards[3]) {
        setIsGameOver(true);
        scoreGame();
        return true;
    }
    else {
      return false;
    }
  }

  function getGoalImage(name: string) {
    if (name in goals) {
      return goals[name].image;
    }
    return "./images/empty.png";
  }

  function getGoalTooltip(name: string) {
    if (name in goals) {
      return goals[name].tooltip;
    }
    return "Unknown goal";
  }

  function getCookieImage(name: string) {
    if (name in cookies) {
      return cookies[name].image;
    }
    return "./images/empty.png";
  }

  function getCookieTooltip(name: string) {
    if (name in cookies) {
      return cookies[name].tooltip;
    }
    return "Unknown cookie";
  }

  async function initializeGoals() {
    const goals = [];
    for (let i = 0; i < 4; i++) {
      goals.push(await getGoalsForPlayer(i));
    }
    setAllGoals(goals);
    return goals;
  }

  async function getGoalsForPlayer(player: number) {
    const response = await fetch(`/api/goals/${player}`);
    const goals = await response.json();
    return goals;
  }

  function showGoalForPlayer(player: number, index: number) {
    if (isGameOver || player === 0) {
      return getGoalImage(allGoals[player][index]);
    }
    else {
      return "./images/goal-mystery.png";
    }
  }

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

  async function drawCard(pile: number) {
    await sendMoveToServer(pile, 0);
  }

  async function handleAIMove(player: number) {
    if (isGameOver) {
      return;
    }
    const allTopCards = await getTopCards();
    await sleep(TURN_DELAY);
    let response = await fetch(`/api/choice/${player}`);
    let choice = await response.text();
    let whichPile = allTopCards.indexOf(choice);
    await sendMoveToServer(whichPile, player);
  }

  async function sendMoveToServer(pile: number, player: number) {
    const body = {
      player,
      pile,
    }
    const didTake = await fetch("/api/take-card", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (didTake) {
      const cardName = getCookieTooltip(topCards[pile]);
      const newEvent = `Player ${player} took ${cardName} from pile ${pile}`;
      const eventLogCopy = eventLog.slice();
      eventLogCopy.push(newEvent);
      setEventLog(eventLogCopy);
      if (player === 0) {
        getMyHoard();
      }
      await getTopCards();
      setPlayerTurn((player + 1) % 4);
    }
  }

  async function getTopCards() {
    const response = await fetch("/api/top-cards");
    const cards = await response.json();
    setTopCards(cards);
    checkForEndGame(cards);
    return cards;
  }

  async function getMyHoard() {
    const response = await fetch("/api/hoard/0");
    const hoard = await response.json();
    setMyHoard(hoard);
    return hoard;
  }

  async function scoreGame() {
    const eventLogCopy = eventLog.slice();
    eventLogCopy.push("Game Over!  Score:");
    const response = await fetch("/api/score");
    const scores = await response.json();
    for (let i = 0; i < 4; i++) {
      eventLogCopy.push(`Player ${i} scored ${scores[i]} points.`);
    }
    eventLogCopy.push(calculateWinners(scores));
    setEventLog(eventLogCopy)
  }

  function calculateWinners(scores: number[]) {
    const maxScore = Math.max(...scores);
    const maxPlayers = [];
    for (let i = 0; i < 4; i++) {
      if (scores[i] === maxScore) {
        maxPlayers.push(i);
      }
    }
    if (maxPlayers.length === 1) {
      return `Player ${maxPlayers[0]} wins!`;
    }
    else {
      return `Players ${maxPlayers} tie for the win!`;
    }
  }

  function printEventLog() {
    let text = "";
    for (const event of eventLog) {
      text += `${event}\n`;
    }
    return text;
  }

  function printMyHoard() {
    let text = "";
    for (const card of myHoard) {
      text += `${getCookieTooltip(card)}\n`;
    }
    return text;
  }

  return (
    <table id="outer" className={styles.container}>
      <tbody>
      <tr id="topRow" className={styles.contentRow}>
        <td className={styles.buffer}></td>
        <td className={styles.card}>
          <img id="player2Goal1" src={showGoalForPlayer(2, 0)} />
        </td>
        <td className={styles.card}>
          <img id="player2Goal2" src={showGoalForPlayer(2, 1)} />
        </td>
        <td className={styles.buffer}></td>
      </tr>
      <tr className={styles.bufferRow}></tr>
      <tr id="midTopRow" className={styles.contentRow}>
        <td>
          <div className={styles.card}>
            <img id="player1Goal1" src={showGoalForPlayer(1, 0)} />
          </div>
          <span className={styles.midBuffer}></span>
        </td>
        <td className={styles.card} id="available1" onClick={() => drawCard(0)}>
          <button disabled={!topCards[0] || playerTurn !== 0}>
            <img src={getCookieImage(topCards[0])} title={getCookieTooltip(topCards[0])} />
          </button>
        </td>
        <td className={styles.card} id="available2" onClick={() => drawCard(1)}>
          <button disabled={!topCards[1] || playerTurn !== 0}>
            <img src={getCookieImage(topCards[1])} title={getCookieTooltip(topCards[1])} />
          </button>
        </td>
        <td>
          <span className={styles.midBuffer}></span>
          <div className={styles.card}>
            <img id="player3Goal1" src={showGoalForPlayer(3, 0)} />
          </div>
        </td>
      </tr>
      <tr id="midBottomRow" className={styles.contentRow}>
        <td>
          <div className={styles.card}>
            <img id="player1Goal2" src={showGoalForPlayer(1, 1)} />
          </div>
          <span className={styles.midBuffer}></span>
        </td>
        <td className={styles.card} id="available3" onClick={() => drawCard(2)}>
          <button disabled={!topCards[2] || playerTurn !== 0}>
            <img src={getCookieImage(topCards[2])} title={getCookieTooltip(topCards[2])} />
          </button>
        </td>
        <td className={styles.card} id="available4" onClick={() => drawCard(3)}>
          <button disabled={!topCards[3] || playerTurn !== 0}>
            <img src={getCookieImage(topCards[3])} title={getCookieTooltip(topCards[3])} />
          </button>
        </td>
        <td>
          <span className={styles.midBuffer}></span>
          <div className={styles.card}>
            <img id="player3Goal2" src={showGoalForPlayer(3, 1)} />
          </div>
        </td>
      </tr>
      <tr className={styles.bufferRow}></tr>
      <tr id="bottomRow" className={styles.contentRow}>
        <td className={styles.buffer}>
          <div><b>Event Log</b></div>
          <textarea readOnly id="log" className={styles.textbox}
                    value={printEventLog()}></textarea>
        </td>
        <td className={styles.card}>
          {allGoals[0] &&
            <img src={getGoalImage(allGoals[0][0])} id="player0Goal1"
                 title={getGoalTooltip(allGoals[0][0])} />
          }
        </td>
        <td className={styles.card}>
          {allGoals[0] &&
            <img src={getGoalImage(allGoals[0][1])} id="player0Goal2"
                 title={getGoalTooltip(allGoals[0][1])} />
          }
        </td>
        <td className={styles.buffer}>
          <div><b>My Hoard</b></div>
          <textarea readOnly id="myHoard" className={styles.textbox}
                    value={printMyHoard()}></textarea>
        </td>
      </tr>
      </tbody>
    </table>
  );
}
