import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

export const part1 = (lines: string[]): number => {
  return lines.map(l => {
    const [, scrambledSegments] = l.split(' | ');
    return scrambledSegments.split(' ').filter(s => [2, 4, 3, 7].includes(s.length)).length;
  }).reduce((sum, count) => sum + count);
}

const findByLength = (input: string[], length: number) => input.find(v => v.length === length)!;
const filterByLength = (input: string[], length: number) => input.filter(v => v.length === length);
const containsAll = (input: string[], chars: string[]): string => input.filter(s => chars.every(c => s.includes(c)))[0];
const removeAll = (input: string, chars: string[]): string => input.split('').filter(c => !chars.includes(c)).join('');

const sortString = (s: string): string => s.split('').sort((a, b ) => a > b ? 1 : -1).join('');

const mapWiresToDigits = (wires: string[]) => {
  let map: string[] = new Array(10);
  map[1] = findByLength(wires, 2)!;
  map[3] = containsAll(filterByLength(wires, 5), [...map[1].split('')]);
  map[4] = findByLength(wires, 4)!;
  map[5] = containsAll(filterByLength(wires, 5), removeAll(map[4], map[1].split('')).split(''));
  map[2] = filterByLength(wires, 5).filter(s => s !== map[3] && s !== map[5])[0];
  map[7] = findByLength(wires, 3)!;
  map[8] = findByLength(wires, 7)!;
  map[9] = containsAll(filterByLength(wires, 6), map[4].split(''));
  map[0] = containsAll(filterByLength(wires, 6).filter(w => w !== map[9]), map[1].split(''));
  map = map.map(d => sortString(d));
  map[6] = wires.filter(w => !map.includes(sortString(w)))[0];
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
