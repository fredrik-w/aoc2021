import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

const visualizeDots = (dots: number[][]): string => {
  const { height, width } = dimensions(dots);
  let lines: string[] = [];
  for(let x=0; x<height; x++) {
    let line: string[] = [];
    for (let y=0; y<width; y++) {
      line.push(dots.findIndex(([dotY, dotX]) => x === dotX && y === dotY) !== -1 ? '#' : '.');
    }
    lines.push(line.join(''));
  }
  return lines.join('\n');
}

const dimensions = (dots: number[][]): { height: number, width: number } => ({ height: Math.max(...dots.map(v => v[0])) + 1, width: Math.max(...dots.map(v => v[1])) + 1 });

const parse = (lines: string[]): { dots: number[][], instructions: string[] } => {
  const dots: number[][] = [];
  const instructions: string[] = [];
  lines.filter(v => v.length).forEach(line => line.startsWith('fold') ? instructions.push(line.substring(11)) : dots.push(line.split(',').map(s => +s)));
  return {dots, instructions};
}

const doFold = (dots: number[][], width: number, height: number): number[][] => {
  const adjust = (pos: number, i: number): number => Math.abs(i - ((2*pos)));

  let newDots: number[][] = [];
  dots.forEach(dot => {
    let [y,x] = dot;
    const newDot = [y > width ? adjust(width, y) : y, x > height ? adjust(height, x) : x];
    newDots.filter(v => v[0] === newDot[0] && v[1] === newDot[1]).length === 0 && newDots.push(newDot);
  });

  return newDots;
}

const fold = (dots: number[][], instructions: string[]): number[][] => {
  let { height: x, width: y } = dimensions(dots);

  instructions.forEach(instruction => {
    const [dir, pos] = instruction.split('=');
    dir === 'y' && (y = +pos);
    dir === 'x' && (x = +pos);
    dots = doFold(dots, x, y);
  });

  return dots;
}

export const part1 = (lines: string[]): number => {
  const {dots, instructions} = parse(lines);
  return fold(dots, [instructions[0]]).length;
};

export const part2 = (lines: string[]): { length: number, output: string } => {
  let {dots, instructions} = parse(lines);
  const foldedDots = fold(dots, instructions);
  return { length: foldedDots.length, output: visualizeDots(foldedDots) };
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
