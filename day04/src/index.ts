import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

const getNumbersAndBoards = (lines: string[]) => {
  const line = (input: string): (string | number)[][] => input.split(/\s+/).filter(k => k.length).map(k => [k, 0]);
  const numbers: string[] = lines[0].split(',');

  let boards: (string | number)[][][][] = [];
  for (let i = 2; i < lines.length; i += 6) {
    boards.push([line(lines[i]), line(lines[i + 1]), line(lines[i + 2]), line(lines[i + 3]), line(lines[i + 4])]);
  }

  return {numbers, boards};
}

const markNumber = (boards: (string | number)[][][][], number: string): boolean => {
  boards.forEach(board => board.forEach(line => line.every(square => {
    if (square[0] !== number) {
      return true;
    }
    square[1] = 1;
  })));
  return true;
}

const winningLine = (line: (string | number)[][]): boolean => {
  return (line[0][1] as number) + (line[1][1] as number) + (line[2][1] as number) + (line[3][1] as number) + (line[4][1] as number) === 5
}

const winningColumn = (board: (string | number)[][][], col: number): boolean => {
  return (board[0][col][1] as number) + (board[1][col][1] as number) + (board[2][col][1] as number) + (board[3][col][1] as number) + (board[4][col][1] as number) === 5;
}

const boardHasWon = (board: (string | number)[][][]): boolean => {
  return winningLine(board[0]) || winningLine(board[1]) || winningLine(board[2]) || winningLine(board[3]) || winningLine(board[4]) || winningColumn(board, 0) || winningColumn(board, 1) || winningColumn(board, 2) || winningColumn(board, 3) || winningColumn(board, 4);
}

export const part1 = (lines: string[]): number => {
  const {numbers, boards} = getNumbersAndBoards(lines);
  let winningBoard: (string | number)[][][] = [];
  let lastNumber: number = 0;
  numbers.every(n => {
    markNumber(boards, n);
    for (let i = 0; i < boards.length; i++) {
      if (boardHasWon(boards[i])) {
        winningBoard = boards[i];
        lastNumber = parseInt(n);
        break;
      }
    }
    return !winningBoard.length;
  });
  const unchecked = winningBoard.flatMap(line => line.filter(square => square[1] === 0).flatMap(square => square[0])).map(v => parseInt(v as string)).reduce((sum, v) => sum + v);
  return unchecked * lastNumber;
}

export const part2 = (lines: string[]): number => {
  return -1;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
