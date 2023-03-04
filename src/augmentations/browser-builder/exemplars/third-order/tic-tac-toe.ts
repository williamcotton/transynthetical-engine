import { Archiver } from "../../../../archive";
import { ThunkSolution } from "../../../../ask";

export const targetType = `pthunk`;

export const prompt = `Write a function that predicts the best move in a game of tic-tac-toe`;

// %EXEMPLAR_START%
async function solution(
  query: any,
  archiver: Archiver
): Promise<ThunkSolution> {
  type Player = "X" | "O" | "_";
  type Board = Player[][];
  type EmptySpace = [number, number];
  function getEmptySpaces(board: Board): EmptySpace[] {
    const emptySpaces: EmptySpace[] = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === null) {
          emptySpaces.push([row, col]);
        }
      }
    }
    return emptySpaces;
  }
  await archiver.add(
    "getEmptySpaces",
    getEmptySpaces,
    [{ board: "array" }],
    `The function getEmptySpaces takes a tic-tac-toe board as input and returns an array of [row, col] pairs corresponding to the empty spaces on the board.`
  );
  function checkWinner(board: Board): Player | "tie" | null {
    for (let i = 0; i < board.length; i++) {
      if (
        board[i][0] !== "_" &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return board[i][0];
      }
      if (
        board[0][i] !== "_" &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i]
      ) {
        return board[0][i];
      }
    }
    if (
      board[0][0] !== "_" &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return board[0][0];
    }
    if (
      board[0][2] !== "_" &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return board[0][2];
    }
    if (getEmptySpaces(board).length === 0) {
      return "tie";
    }
    return null;
  }
  await archiver.add(
    "checkWinner",
    checkWinner,
    [{ board: "array" }],
    `The function checkWinner takes a tic-tac-toe board as input and returns the winner of the game (either "X", "O", or "tie") or null if the game is not over.`
  );
  function minimax(
    board: Board,
    depth: number,
    isMaximizingPlayer: boolean
  ): number {
    const winner = checkWinner(board);
    if (winner === "X") {
      return 10 - depth;
    } else if (winner === "O") {
      return depth - 10;
    } else if (winner === "tie") {
      return 0;
    }
    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      const emptySpaces = getEmptySpaces(board);
      for (let i = 0; i < emptySpaces.length; i++) {
        const [row, col] = emptySpaces[i];
        const newBoard: Board = board.map((row) => [...row]);
        newBoard[row][col] = "X";
        const score = minimax(newBoard, depth + 1, false);
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      const emptySpaces = getEmptySpaces(board);
      for (let i = 0; i < emptySpaces.length; i++) {
        const [row, col] = emptySpaces[i];
        const newBoard: Board = board.map((row) => [...row]);
        newBoard[row][col] = "O";
        const score = minimax(newBoard, depth + 1, true);
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  }
  await archiver.add(
    "minimax",
    minimax,
    [{ board: "array", depth: "number", isMaximizingPlayer: "boolean" }],
    `The function minimax takes a tic-tac-toe board as input along with the current depth in the game tree and a boolean indicating whether the maximizing player is the current player or not, and returns the score of the board from the perspective of the maximizing player.`
  );
  function predictBestMove(board: Board, player: Player): [number, number] {
    const emptySpaces = getEmptySpaces(board);
    const scores: number[] = [];
    for (let i = 0; i < emptySpaces.length; i++) {
      const [row, col] = emptySpaces[i];
      const newBoard: Board = board.map((row) => [...row]);
      newBoard[row][col] = player;
      const score = minimax(newBoard, 0, false);
      scores.push(score);
    }
    const maxScoreIndex = scores.indexOf(Math.max(...scores));
    const [row, col] = emptySpaces[maxScoreIndex];
    return [row, col];
  }
  await archiver.add(
    "predictBestMove",
    predictBestMove,
    [{ board: "array", player: "string" }],
    `The function predictBestMove takes a tic-tac-toe board as input along with the player whose turn it is (either "X" or "O") and returns the best move for that player as an array of [row, col]. The function accomplishes this by using the minimax algorithm to recursively evaluate the game tree, assuming that both players play optimally, and choosing the move that leads to the highest score for the player whose turn it is.`,
    `// Example Tic-Tac-Toe board
const board = [
  ["X", "O", "O"],
  ["_", "X", "_"],
  ["O", "_", "X"],
];

// Determine the best move for the player ("X")
const [row, col] = predictBestMove(board, "X");

// Output the best move
console.log("Best move: " + row + ", " + col);`
  );
  return {
    answer: ["getEmptySpaces", "checkWinner", "minimax", "predictBestMove"],
    solutions: [],
    computed: true,
    query: false,
  };
}
// %EXEMPLAR_END%

export default solution;
