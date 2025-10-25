function gameboard() {
  const rows = 6;
  const columns = 7;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push("hello");
    }
  }
  console.log(board);
}
const cell = document.createAttribute("div");
console.log(cell);

// function cell() {
//   cell.style.height = "24px";
//   cell.style.width = "24px";
//   cell.style.backgroundColor = "red";
// }

// cell();

gameboard();
