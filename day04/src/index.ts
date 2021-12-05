import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

class Board {
  private marked: number[];

  constructor(private numbers: string[]) {
    this.marked = new Array(numbers.length).fill(0);
  }

  public markNumber(number: string) {
    const idx = this.numbers.findIndex(val => val === number);
    idx !== -1 && (this.marked[idx] = 1);
  }

  public winningLine(line: number): boolean {
    return this.marked[line] + this.marked[line + 1] + this.marked[line + 2] + this.marked[line + 3] + this.marked[line + 4] === 5;
  }

  public winningColumn(col: number): boolean {
    return this.marked[col] + this.marked[col + 5] + this.marked[col + 10] + this.marked[col + 15] + this.marked[col + 20] === 5;
  }

  public hasWon(): boolean {
    return this.winningLine(0) || this.winningLine(5) || this.winningLine(10) || this.winningLine(15) || this.winningLine(20) || this.winningColumn(0) || this.winningColumn(1) || this.winningColumn(2) || this.winningColumn(3) || this.winningColumn(4);
  }

  public sumOfUnchecked(): number {
    return this.numbers.filter((v, idx) => this.marked[idx] === 0).map(s => parseInt(s)).reduce((sum, num) => sum + num, 0);
  }
}

const getNumbersAndBoards = (lines: string[]): { numbers: string[], boards: Board[] } => {
  const line = (input: string): (string)[] => input.split(/\s+/).filter(k => k.length);
  const numbers: string[] = lines[0].split(',');

  let boards: Board[] = [];
  for (let i = 2; i < lines.length; i += 6) {
    boards.push(new Board([...line(lines[i]), ...line(lines[i + 1]), ...line(lines[i + 2]), ...line(lines[i + 3]), ...line(lines[i + 4])]));
  }

  return {numbers, boards};
}

const drawAndMark = (lines: string[], breakCondition: (x: Array<unknown>, y: Array<unknown>) => boolean): { winners: Board[], lastNumber: number } => {
  let {numbers, boards} = getNumbersAndBoards(lines);
  let winners: Board[] = [];
  let lastNumber: string = '-1';
  numbers.every(n => {
    lastNumber = n;
    for (let i = 0; i < boards.length; i++) {
      if (!winners.includes(boards[i])) {
        boards[i].markNumber(n);
        if (boards[i].hasWon()) {
          winners.push(boards[i]);
        }
      }
    }
    return breakCondition(winners, boards);
  });
  return {winners, lastNumber: parseInt(lastNumber)};
}

export const part1 = (lines: string[]): number => {
  const {winners, lastNumber} = drawAndMark(lines, (x, y) => x.length === 0);
  return winners[0].sumOfUnchecked() * lastNumber;
}

export const part2 = (lines: string[]): number => {
  const {winners, lastNumber} = drawAndMark(lines, (x, y) => x.length !== y.length);
  return winners[winners.length - 1].sumOfUnchecked() * lastNumber;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
