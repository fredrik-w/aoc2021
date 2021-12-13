import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

const visualize = (paper: number[][]): void => paper.forEach(line => console.log(line.map(v => v === 0 ? '.' : '#').join('')))

const parse = (lines: string[]): { paper: number[][], instructions: string[] } => {
  const dots: number[][] = [];
  const instructions: string[] = [];
  lines.filter(v => v.length).forEach(line => line.startsWith('fold') ? instructions.push(line.substring(11)) : dots.push(line.split(',').map(s => +s)));
  let paper: number[][] = new Array(Math.max(...dots.map(v => v[1])) + 1).fill(0).map(_ => new Array(Math.max(...dots.map(v => v[0])) + 1).fill(0));
  dots.forEach(([y, x]) => paper[x][y] = 1);
  return {paper, instructions};
}

const fold = (paper: number[][], instructions: string[], printResult: boolean = false): number => {
  instructions.forEach(inst => {
    let [dir, cut] = inst.split('=');
    if (dir === 'y') {
      paper.slice(+cut + 1).reverse().forEach((line, x) => line.forEach((v, y) => paper[x][y] = paper[x][y] || v));
      paper = paper.slice(0, +cut);
    } else if (dir === 'x') {
      paper.forEach((line, y) => {
        line.slice(+cut).reverse().forEach((v, idx) => line[idx] = line[idx] || v);
        paper[y] = line.slice(0, +cut);
      })
    }
  });
  printResult && visualize(paper);
  return paper.flat().filter(v => v === 1).length;
}

export const part1 = (lines: string[]): number => {
  let {paper, instructions} = parse(lines);
  return fold(paper, [instructions[0]]);
};

export const part2 = (lines: string[]): number => {
  let {paper, instructions} = parse(lines);
  return fold(paper, instructions, true);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));


