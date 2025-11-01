function Gameboard() {
  const columns = 3;
  const rows = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  const getBoard = () => board;

  const chooseCell = (row, column, player) => {
    const availableRows = [];

    if (board[row][column].getValue() !== 0) {
      return false;
    }
    board[row][column].addToken(player);
    return true;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  const checkWin = (player) => {
    for (let i = 0; i < rows; i++) {
      if (
        board[i][0].getValue() === player &&
        board[i][1].getValue() === player &&
        board[i][2].getValue() === player
      ) {
        return true;
      }
    }

    for (let j = 0; j < columns; j++) {
      if (
        board[0][j].getValue() === player &&
        board[1][j].getValue() === player &&
        board[2][j].getValue() === player
      ) {
        return true;
      }
    }

    // Check diagonals
    if (
      board[0][0].getValue() === player &&
      board[1][1].getValue() === player &&
      board[2][2].getValue() === player
    ) {
      return true;
    }

    if (
      board[0][2].getValue() === player &&
      board[1][1].getValue() === player &&
      board[2][0].getValue() === player
    ) {
      return true;
    }

    return false;
  };

  const isFull = () => {
    return board.every((row) => row.every((cell) => cell.getValue() !== 0));
  };

  return {
    getBoard,
    chooseCell,
    printBoard,
    checkWin,
    isFull,
  };
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

function GameController(playerOneName, playerTwoName) {
  playerOneName = prompt("Enter player one's name: ");
  playerTwoName = prompt("Enter player two's name: ");

  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "X",
      score: 0,
    },
    {
      name: playerTwoName,
      token: "O",
      score: 0,
    },
  ];

  let activePlayer = players[0];
  let gameOver = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    if (gameOver) {
      console.log("Game is over!");
      return;
    }
    console.log(
      `${getActivePlayer().name} places ${
        getActivePlayer().token
      } at row ${row}, column ${column}...`
    );
    const success = board.chooseCell(row, column, getActivePlayer().token);

    if (!success) {
      console.log("Cell is already occupied! Choose another cell.");
      return;
    }

    if (board.checkWin(getActivePlayer().token)) {
      console.log(`${getActivePlayer().name} wins!`);
      getActivePlayer().score++;
      gameOver = true;
      board.printBoard();
      return;
    }

    if (board.isFull()) {
      console.log("Game is a draw!");
      gameOver = true;
      board.printBoard();
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };
  printNewRound();
  const getPlayers = () => players;

  const isGameOver = () => gameOver;

  return {
    playRound,
    getActivePlayer,
    isGameOver,
    getPlayers,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  const game = GameController();

  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const player1 = document.querySelector(".player-1");
  const player2 = document.querySelector(".player-2");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const players = game.getPlayers();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    if (game.isGameOver()) {
      playerTurnDiv.textContent = `${activePlayer.name} wins!`; // ← ADD THIS
    } else {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
    }

    player1.textContent = `${players[0].name}: ${players[0].score}`;
    player2.textContent = `${players[1].name}: ${players[1].score}`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;

        cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();

        boardDiv.appendChild(cellButton);
      });
    });

    const resetGame = () => {
      const board = game.getBoard();
      board.forEach((row) => {
        row.forEach((cell) => {
          cell.addToken(0);
        });
      });
      // Don't reset the game controller, just restart the board
      location.reload(); // Simple solution to restart with same scores
    };
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedColumn || !selectedRow) return;

    game.playRound(selectedRow, selectedColumn);

    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

ScreenController();
