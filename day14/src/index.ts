import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

const parse = (lines: string[]): { start: string, rules: Map<string, string> } => {
  const start = lines[0];
  const rules: Map<string, string> = new Map();

  for (let i=2; i<lines.length; i++) {
    const [ match, insert ] = lines[i].split(' -> ');
    rules.set(match, insert);
  }
  return { start, rules };
}

const polymerise = (input: string, rules: Map<string, string>): string => {
  let output: string = '';
  for (let i=0; i < input.length-1; i++) {
    output += input[i] + rules.get(input.slice(i, i+2));
  }
  return output + input.slice(-1);
}

const occurances = (input: string) => {
  let heatMap: Map<string, number> = new Map();
  input.split('').forEach(v => heatMap.set(v, heatMap.has(v) ? heatMap.get(v)!+1 : 1));
  return heatMap;
}

export const part1 = (lines: string[]): number => {
  const { start, rules } = parse(lines);
  let data: string = start;
  for (let i=0; i<10; i++) {
    data = polymerise(data, rules);
  }
  const distribution = [...occurances(data).entries()].sort((a, b) => a[1] > b[1] ? 1 : -1);
  return distribution[distribution.length-1][1] - distribution[0][1];
};

export const part2 = (lines: string[]): number => {
  return -1;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
