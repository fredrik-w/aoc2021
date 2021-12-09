import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

export const part1 = (lines: string[]): number => {
  const getAdjacent = (lines: string[], row: number, col: number): number[] => {
    let values: number[] = [];
    col > 0 && values.push(+lines[row].charAt(col - 1));
    row > 0 && values.push(+lines[row - 1].charAt(col));
    col < lines[row].length-1 && values.push(+lines[row].charAt(col + 1));
    row < lines.length-1 && values.push(+lines[row + 1].charAt(col));
    return values;
  }

  let minPoints: number[] = [];
  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      const adjacent = getAdjacent(lines, row, col);
      let char = +lines[row].charAt(col);
      !adjacent.includes(char) && Math.min(char, ...adjacent) === char && minPoints.push(char + 1);
    }
  }
  return minPoints.reduce((sum, val) => sum + val);
}

export const part2 = (lines: string[]): number => {
  return -1;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
