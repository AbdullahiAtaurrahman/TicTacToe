function Gameboard() {
  const rows = 6;
  const columns = 7;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  const getBoard = () => board;

  const dropToken = (column, player) => {
    const availableRows = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i][column].getValue() === 0) {
        availableRows.push(i);
      }
    }

    if (availableRows.length === 0) return;

    const lowestRow = availableRows[availableRows.length - 1];
    board[lowestRow][column].addToken(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return {
    getBoard,
    dropToken,
    printBoard,
  };
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (column) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${column}...`
    );

    board.dropToken(column, getActivePlayer().token);

    switchPlayerTurn();

    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  const game = GameController();

  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        cellButton.dataset.column = index;

        cellButton.textContent = cell.getValue();

        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;

    if (!selectedColumn) return;

    game.playRound(selectedColumn);

    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

ScreenController();
