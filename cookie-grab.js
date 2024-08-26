const numPlayers = 4;

const cookieTypes = [
    "chocolate-chip",
    "chocolate-fudge",
    "creme-sandwich",
    "frosted-sugar",
    "holiday-tree",
    "meringue",
    "oatmeal-raisin",
    "peanut-butter-chocolate",
    "peanut-butter",
    "sugar-cookie"
];

const tooltips = [
    "Chocolate Chip",
    "Chocolate Fudge",
    "Creme Sandwich",
    "Frosted Sugar",
    "Holiday Tree",
    "Meringue",
    "Oatmeal Raisin",
    "Peanut Butter Chocolate",
    "Peanut Butter",
    "Sugar"
];

const goals = [
    "chocolate-collector",
    "peanut-butter-collector",
    "sugar-collector",
    "unique-collector",
    "same-collector"
];

const validCardsForGoal = {
    "chocolate-collector": ["chocolate-chip", "chocolate-fudge",
                            "peanut-butter-chocolate", "creme-sandwich"],
    "peanut-butter-collector": ["peanut-butter-chocolate", "peanut-butter"],
    "sugar-collector": ["sugar-cookie", "frosted-sugar"]
};

const requiredCardCount = {
    "chocolate-collector": numPlayers * 2,
    "peanut-butter-collector": numPlayers,
    "sugar-collector": numPlayers,
    "unique-collector": 7,
    "same-collector": 3
}

function createTooltip(name) {
    const index = cookieTypes.indexOf(name);
    return tooltips[index];
}

function createDeck() {
    const deck = [];
    const available = [];
    for (let i = 0; i < cookieTypes.length; i++) {
        for (let j = 0; j < numPlayers; j++) {
            available.push(cookieTypes[i]);
        }
    }
    while (available.length > 0) {
        let choice = Math.floor(Math.random() * available.length);
        deck.push(available[choice]);
        available.splice(choice, 1); // delete the item
    }
    return deck;
}

function dealDeck(deck) {
    const piles = [];
    const pileSize = deck.length / 4;
    for (let pile = 0; pile < 4; pile++) {
        // deal 1/4 of the deck into each pile
        piles.push(deck.slice(pile * pileSize, (pile + 1) * pileSize));
    }
    return piles;
}

function flipTopCardOfPile(pileNumber, pileContents) {
    // get element
    const elementId = `available${pileNumber + 1}`;
    const element = document.getElementById(elementId);
    // check top card of pile
    const card = pileContents[0];
    // flip it face-up
    element.innerHTML = `<img src="images/${card}.png" title="${createTooltip(card)}">`;
}

function flipTopCardOfAllPiles(piles) {
    for (let i = 0; i < 4; i++) {
        flipTopCardOfPile(i, piles[i]);
    }
}

function replaceTopCardOfPile(pileNumber) {
    const elementId = `available${pileNumber + 1}`;
    const element = document.getElementById(elementId);
    if (deckPiles[pileNumber].length !== 0) {
        let card = deckPiles[pileNumber][0];
        element.innerHTML = `<img src="images/${card}.png" title="${createTooltip(card)}">`;
    }
    else {
        element.innerHTML = `<img src="images/empty.png">`;
        element.onclick = undefined;
        if (areAllPilesEmpty()) {
            scoreGame();
        } 
    }
}

function drawCard(pile) {
    const taken = deckPiles[pile].shift();
    hoards[playerTurn].push(taken);
    const eventLog = document.getElementById("log");
    eventLog.innerHTML += `Player ${playerTurn} takes ${taken}\n`;
    eventLog.scrollTop = eventLog.scrollHeight;
    if (playerTurn === 0) {
        const myHoard = document.getElementById("myHoard");
        myHoard.innerHTML += `${taken}\n`;
        myHoard.scrollTop = myHoard.scrollHeight;
    }
    replaceTopCardOfPile(pile, deckPiles);
    playerTurn = (playerTurn + 1) % numPlayers;
}

function createHoards() {
    const hoards = [];
    for (let i = 0; i < numPlayers; i++) {
        hoards.push([]);
    }
    return hoards;
}

function assignGoals() {
    const available = goals.slice().concat(goals.slice());
    const theGoals = [];
    for (let i = 0; i < numPlayers; i++) {
        theGoals.push(chooseTwoDifferentGoals(available));
    }
    renderGoals(theGoals, 0);
    return theGoals;
}

function chooseTwoDifferentGoals(available) {
    const choice1 = Math.floor(Math.random() * available.length);
    const goal1 = available[choice1];
    available.splice(choice1, 1);
    let goal2 = goal1;
    let choice2;
    while (goal2 === goal1) {
        choice2 = Math.floor(Math.random() * available.length);
        goal2 = available[choice2];
    }
    available.splice(choice2, 1);
    return [goal1, goal2];
}

function renderGoals(goals, playerNumber) {
    const theGoals = goals[playerNumber];
    const goal1 = document.getElementById(`player${playerNumber}Goal1`);
    goal1.src = `images/goal-${theGoals[0]}.png`;
    goal1.title = theGoals[0];
    const goal2 = document.getElementById(`player${playerNumber}Goal2`);
    goal2.src = `images/goal-${theGoals[1]}.png`;
    goal2.title = theGoals[1];
}

function areAllPilesEmpty() {
    for (const pile of deckPiles) {
        if (pile.length !== 0) {
            return false;
        }
    }
    return true;
}

function scoreGame() {
    const eventLog = document.getElementById("log");
    eventLog.innerHTML += `Game over!\n`;
    const scores = [];
    for (let i = 0; i < numPlayers; i++) {
        scores.push(scorePlayer(i));
        eventLog.innerHTML += `Player ${i} scored ${scores[i]} points!\n`;
        eventLog.scrollTop = eventLog.scrollHeight;
    }
}

function scorePlayer(playerNumber) {
    const theirCards = hoards[playerNumber];
    const theirGoals = playerGoals[playerNumber];
    renderGoals(playerGoals, playerNumber);
    let score = 0;
    score += evaluateGoal(theirGoals[0], theirCards) ? 5 : 0;
    score += evaluateGoal(theirGoals[1], theirCards) ? 5 : 0;
    return score;
}

function evaluateGoal(goal, cards) {
    if (["chocolate-collector", "peanut-butter-collector", "sugar-collector"]
        .includes(goal)) {
        let count = 0;
        for (let card of cards) {
            if(validCardsForGoal[goal].includes(card)) {
                count++;
            }
        }
        return count >= requiredCardCount[goal];
    }
    else if (goal === "unique-collector") {
        const uniqueSet = new Set(cards)
        return uniqueSet.size >= requiredCardCount[goal];
    }
    else if (goal === "same-collector") {
        const validSets = [];
        for (let card of cards) {
            let first = cards.indexOf(card);
            let last = cards.lastIndexOf(card);
            if (first !== last && !validSets.includes(card)) {
                validSets.push(card);
            }
        }
        return validSets.length >= requiredCardCount[goal];
    }
    return false;
}

// Kind of main function
const deck = createDeck();
const deckPiles = dealDeck(deck);
flipTopCardOfAllPiles(deckPiles);
const hoards = createHoards();
let playerTurn = 0;
const playerGoals = assignGoals();

