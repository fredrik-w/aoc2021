import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

const parse = (lines: string[]): { start: string, rules: Map<string, string> } => {
  const start = lines.shift()!;
  const rules: Map<string, string> = new Map();

  lines.shift();
  lines.map(line => line.split(' -> ')).forEach(([match, insert]) => rules.set(match, insert));

  return {start, rules};
}

const add = (collection: Map<string, number>, key: string, amount: number = 1) => collection.has(key) ? collection.get(key)! + amount : amount;
const sum = (collection: Map<string, number>, key: string) => collection.has(key) ? collection.get(key)! : 0;

const occurrences = (pairs: Map<string, number>) => {
  let heatMap: Map<string, number> = new Map();
  [...pairs.entries()].forEach(([pair, amount]) => {
    const [char] = pair.split('');
    heatMap.set(char, sum(heatMap, char) + amount);
  })
  return heatMap;
}

const solve = (lines: string[], iterations: number): number => {
  const {start, rules} = parse(lines);

  let pairs: Map<string, number> = new Map();
  for (let i = 0; i < start.length - 1; i++) {
    let pair = start.slice(i, i + 2);
    pairs.set(pair, add(pairs, pair));
  }

  for (let i = 0; i < iterations; i++) {
    let newPairs: Map<string, number> = new Map();

    for (let [p, count] of pairs) {
      if (rules.has(p)) {
        const char = rules.get(p);
        const [left, right] = p.split('');
        newPairs.set(left + char, add(newPairs, left + char, count));
        newPairs.set(char + right, add(newPairs, char + right, count));
      } else {
        newPairs.set(p, count);
      }
    }

    pairs = newPairs;
  }

  const distribution = [...occurrences(pairs).entries()].sort((a, b) => a[1] > b[1] ? 1 : -1).map(v => v[0] === start.slice(-1) ? [v[0], v[1]+1] : v);
  return +distribution[distribution.length - 1][1] - +distribution[0][1];
}

export const part1 = (lines: string[]): number => {
  return solve(lines, 10);
};

export const part2 = (lines: string[]): number => {
  return solve(lines, 40);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
