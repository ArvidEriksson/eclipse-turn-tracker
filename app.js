const indexPage = document.getElementById("indexPage");
const selectionPage = document.getElementById("selectionPage");
const turnPage = document.getElementById("turnPage");
const nextTurnPage = document.getElementById("nextTurnPage");

const pages = [indexPage, selectionPage, turnPage, nextTurnPage];

function switchPageTo(page) {
  // Move 'page' to front.
  for (let i = 0; i < pages.length; i++) {
    if (pages[i] == page) {
      pages[i].style.zIndex = 1000;
    } else {
      pages[i].style.zIndex = i;
    }
  }
}

// Colors: Unassigned, player 1...6
const colors = ["white", "yellow", "green", "red", "blue", "white", "black"];

// Find buttons and add functionality
const buttons = [];
const buttonStates = [];
for (let i = 0; i < 7; i++) {
  buttons[i] = document.getElementById("b" + (i + 1));
  buttonStates[i] = 0;
  if (i != 6) {
    buttons[i].style.backgroundColor = colors[i + 1];
  }
  buttons[i].onclick = function () {
    // changeColor("b" + (i+1))
    changeState("b" + (i + 1));
  };
}

function changeColor(id) {
  // Change button to random color.
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  document.getElementById(id).style.backgroundColor = "#" + randomColor;
}

// turnPage Functionality.
var players = [];
var order = [];
var skipOrder = [];
var queue = [];
var allSkipped = 0;
var turnCounter = 0;

// Add checkmark.
function changeState(id) {
  const btn = document.getElementById(id);
  buttonStates[parseInt(id[1])] = (buttonStates[parseInt(id[1])] + 1) % 2;
  if (buttonStates[parseInt(id[1])] == 1) {
    btn.textContent = "✓";
  } else {
    btn.textContent = "";
  }
}

// Add Players with onstate to 'players'
function addPlayers() {
  players = [];
  j = 0;
  for (i = 0; i < buttons.length; i++) {
    if (buttonStates[i] == 1) {
      players[j] = i;
      j++;
    }
  }
}
// Randomizes an Array
// Stolen from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function chooseOrder() {
  order = [...players];
  shuffleArray(order);
}

function nextTurn() {
  // do something to order
  turnCounter++;
  document.getElementById("turnCounter").textContent = turnCounter;
  queue = [...skipOrder];
  skipOrder = [];
  allSkipped = 0;
  switchPageTo(nextTurnPage);
  document.getElementById("nextTurnPageButton").textContent = turnCounter;
}

function playerSkip() {
  if (skipOrder.includes(queue[0]) === false) {
    skl = skipOrder.push(queue[0]); // Push returns length of Array
    if (skl >= players.length) {
      allSkipped = 1;
    }
  }
}

function updateQueue() {
  if (allSkipped == 0) {
    queue.push(queue.shift());
  } else if (queue[0] == order[order.length - 1]) {
    nextTurn();
  } else {
    queue.shift();
    queue.push(0);
  }
}

function updateQueueColors() {
  // Update nextturns colors
  document.getElementById("turnButton").style.backgroundColor =
    colors[queue[0]];
  for (i = 1; i < queue.length; i++) {
    document.getElementById("nextTurn" + i).style.backgroundColor =
      colors[queue[i]];
  }
  if (skipOrder.includes(queue[0])) {
    document.getElementById("turnButton").textContent = "SKIPPED";
  } else {
    document.getElementById("turnButton").textContent = "";
  }
}

// Start in IndexPage
switchPageTo(selectionPage);

// Button functionality
document.getElementById("selectionButton").onclick = function () {
  switchPageTo(selectionPage);
};
document.getElementById("b7").onclick = function () {
  for (i = 1; i < 6; i++) {
    document.getElementById("nextTurn" + i).style.backgroundColor = "grey";
  }
  addPlayers();
  chooseOrder();
  turnCounter = 0;
  skipOrder = [...order];
  nextTurn();
  updateQueueColors();
  switchPageTo(turnPage);
};
document.getElementById("turnButton").onclick = function () {
  updateQueue();
  updateQueueColors();
};

document.getElementById("skipButton").onclick = function () {
  playerSkip();
  updateQueue();
  updateQueueColors();
};

document.getElementById("nextTurnPageButton").onclick = function () {
  switchPageTo(turnPage);
};
