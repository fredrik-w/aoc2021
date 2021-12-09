import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

export const part1 = (lines: string[]): number => {
  return lines.map(l => {
    const [, scrambledSegments] = l.split(' | ');
    return scrambledSegments.split(' ').filter(s => [2, 4, 3, 7].includes(s.length)).length;
  }).reduce((sum, count) => sum + count);
}

const filterByLength = (input: string[], length: number) => input.filter(v => v.length === length);
const containsAllChars = (input: string[], chars: string[]): string => input.filter(s => chars.every(c => s.includes(c)))[0];
const removeAllChars = (input: string, chars: string[]): string => input.split('').filter(c => !chars.includes(c)).join('');
const sortString = (s: string): string => s.split('').sort((a, b ) => a > b ? 1 : -1).join('');

const mapWiresToDigits = (wires: string[]) => {
  let map: string[] = new Array(10);
  map[1] = filterByLength(wires, 2)[0];
  map[3] = containsAllChars(filterByLength(wires, 5), [...map[1].split('')]);
  map[4] = filterByLength(wires, 4)[0];
  map[5] = containsAllChars(filterByLength(wires, 5), removeAllChars(map[4], map[1].split('')).split(''));
  map[2] = filterByLength(wires, 5).filter(s => s !== map[3] && s !== map[5])[0];
  map[7] = filterByLength(wires, 3)[0];
  map[8] = filterByLength(wires, 7)[0];
  map[9] = containsAllChars(filterByLength(wires, 6), map[4].split(''));
  map[0] = containsAllChars(filterByLength(wires, 6).filter(w => w !== map[9]), map[1].split(''));
  map = map.map(d => sortString(d));
  map[6] = sortString(wires.filter(w => !map.includes(sortString(w)))[0]);
  return map;
}

export const part2 = (lines: string[]): number => {
  return lines.map(line => {
    const [wires, segments] = line.split(' | ').map(s => s.split(' '));
    const wireMap = mapWiresToDigits(wires);
    return +segments.map(s => sortString(s)).map(s => wireMap.indexOf(s)).join('');
  }).reduce((sum, val) => sum + val);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
