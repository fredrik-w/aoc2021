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

const mapAllWires = (wires: string[]) => {
  let mapping = {
    top: '',
    top_left: '',
    top_right: '',
    middle: '',
    bottom_left: '',
    bottom_right: '',
    bottom: ''
  }
  const one = findByLength(wires, 2)!;
  const four = findByLength(wires, 4)!;
  const seven = findByLength(wires, 3)!;
  const eight = findByLength(wires, 7)!;
  const nine = containsAll(filterByLength(wires, 6), four.split(''));
  mapping.top = removeAll(findByLength(wires, 3), findByLength(wires, 2).split(''));
  const three = containsAll(filterByLength(wires, 5), [...one.split(''), mapping.top]);
  mapping.bottom = removeAll(three, [...seven.split(''), ...four.split('')]);
  mapping.bottom_left = removeAll(eight, nine.split(''));
  mapping.middle = removeAll(three, [...one.split(''), mapping.bottom, mapping.top]);
  mapping.top_left = removeAll(four, [...one.split(''), mapping.middle]);
  const six = containsAll(filterByLength(wires, 6), [mapping.top, mapping.top_left, mapping.middle, mapping.bottom_left, mapping.bottom]);
  mapping.bottom_right = removeAll(six, [mapping.top, mapping.top_left, mapping.middle, mapping.bottom_left, mapping.bottom]);
  mapping.top_right = removeAll('abcdefg', [mapping.top, mapping.top_left, mapping.middle, mapping.bottom_left, mapping.bottom, mapping.bottom_right]);
  return mapping;
}

function generateSegmentMap(wires: {[key in string]: string}, segments: string[]): string[] {
  return [
    containsAll(segments.filter(s => s.length === 6), [wires.top, wires.top_left, wires.top_right, wires.bottom_left, wires.bottom_right, wires.bottom]),
    containsAll(segments.filter(s => s.length === 2), [wires.top_right, wires.bottom_right]),
    containsAll(segments.filter(s => s.length === 5), [wires.top, wires.top_right, wires.middle, wires.bottom_left, wires.bottom]),
    containsAll(segments.filter(s => s.length === 5), [wires.top, wires.top_right, wires.middle, wires.bottom_right, wires.bottom]),
    containsAll(segments.filter(s => s.length === 4), [wires.top_left, wires.top_right, wires.middle, wires.bottom_right]),
    containsAll(segments.filter(s => s.length === 5), [wires.top, wires.top_left, wires.middle, wires.bottom_right, wires.bottom]),
    containsAll(segments.filter(s => s.length === 6), [wires.top, wires.top_left, wires.middle, wires.bottom_right, wires.bottom_left, wires.bottom]),
    containsAll(segments.filter(s => s.length === 3), [wires.top, wires.top_right, wires.bottom_right]),
    containsAll(segments.filter(s => s.length === 7), [wires.top, wires.top_left, wires.top_right, wires.middle, wires.bottom_left, wires.bottom_right, wires.bottom]),
    containsAll(segments.filter(s => s.length === 6), [wires.top, wires.top_left, wires.top_right, wires.middle, wires.bottom_right, wires.bottom]),
  ];
}

export const part2 = (lines: string[]): number => {
  return lines.map(line => {
    const [wires, segments] = line.split(' | ').map(s => s.split( ' '));
    const wiresMap = mapAllWires(wires);

    const sortedSegments = segments.map(s => s.split('').sort((a, b) => a > b ? 1 : -1).join(''));
    const segmentsMap = generateSegmentMap(wiresMap, sortedSegments);

    return +sortedSegments.map(s => segmentsMap.findIndex(m => m === s)).join('');
  }).reduce((sum, val) => sum + val);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
