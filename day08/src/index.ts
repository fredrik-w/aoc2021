import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

export const part1 = (lines: string[]): number => {
  const original = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'];
  const analyzeOccurrenceByLength = (scrambled: string[]): number => {
    const byLength = (length: number) => scrambled.filter(wires => wires.length === length).length;
    return byLength(original[1].length) + byLength(original[4].length) + byLength(original[7]!.length) + byLength(original[8]!.length);
  }
  return lines.map(l => {
    const [, scrambledSegments] = l.split(' | ');
    return analyzeOccurrenceByLength(scrambledSegments.split(' '))
  }).reduce((sum, count) => sum + count);
}

enum Wire {
  TOP, TOP_LEFT, TOP_RIGHT, MIDDLE, BOTTOM_LEFT, BOTTOM_RIGHT, BOTTOM
}
const findByLength = (input: string[], length: number) => input.find(v => v.length === length)!;
const filterByLength = (input: string[], length: number) => input.filter(v => v.length === length);
const containsAll = (input: string[], chars: string[]): string => input.filter(s => chars.every(c => s.includes(c)))[0];
const removeAll = (input: string, chars: string[]): string => input.split('').filter(c => !chars.includes(c)).join('');

const mapAllWires = (wires: string[]) => {
  let mapping = {
    [Wire.TOP]: '',
    [Wire.TOP_LEFT]: '',
    [Wire.TOP_RIGHT]: '',
    [Wire.MIDDLE]: '',
    [Wire.BOTTOM_LEFT]: '',
    [Wire.BOTTOM_RIGHT]: '',
    [Wire.BOTTOM]: ''
  }
  const one = findByLength(wires, 2)!;
  const four = findByLength(wires, 4)!;
  const seven = findByLength(wires, 3)!;
  const eight = findByLength(wires, 7)!;
  const nine = containsAll(filterByLength(wires, 6), four.split(''));
  mapping[Wire.TOP] = removeAll(findByLength(wires, 3), findByLength(wires, 2).split(''));
  const three = containsAll(filterByLength(wires, 5), [...one.split(''), mapping[Wire.TOP]]);
  mapping[Wire.BOTTOM] = removeAll(three, [...seven.split(''), ...four.split('')]);
  mapping[Wire.BOTTOM_LEFT] = removeAll(eight, nine.split(''));
  mapping[Wire.MIDDLE] = removeAll(three, [...one.split(''), mapping[Wire.BOTTOM], mapping[Wire.TOP]]);
  mapping[Wire.TOP_LEFT] = removeAll(four, [...one.split(''), mapping[Wire.MIDDLE]]);
  const six = containsAll(filterByLength(wires, 6), [mapping[Wire.TOP], mapping[Wire.TOP_LEFT], mapping[Wire.MIDDLE], mapping[Wire.BOTTOM_LEFT], mapping[Wire.BOTTOM]]);
  mapping[Wire.BOTTOM_RIGHT] = removeAll(six, [mapping[Wire.TOP], mapping[Wire.TOP_LEFT], mapping[Wire.MIDDLE], mapping[Wire.BOTTOM_LEFT], mapping[Wire.BOTTOM]]);
  mapping[Wire.TOP_RIGHT] = removeAll('abcdefg', [mapping[Wire.TOP], mapping[Wire.TOP_LEFT], mapping[Wire.MIDDLE], mapping[Wire.BOTTOM_LEFT], mapping[Wire.BOTTOM], mapping[Wire.BOTTOM_RIGHT]]);
  return mapping;
}

function generateSegmentMap(wires: {[key in number]: string}, segments: string[]): string[] {
  return [
    containsAll(segments.filter(s => s.length === 6), [wires[Wire.TOP], wires[Wire.TOP_LEFT], wires[Wire.TOP_RIGHT], wires[Wire.BOTTOM_LEFT], wires[Wire.BOTTOM_RIGHT], wires[Wire.BOTTOM]]),
    containsAll(segments.filter(s => s.length === 2), [wires[Wire.TOP_RIGHT], wires[Wire.BOTTOM_RIGHT]]),
    containsAll(segments.filter(s => s.length === 5), [wires[Wire.TOP], wires[Wire.TOP_RIGHT], wires[Wire.MIDDLE], wires[Wire.BOTTOM_LEFT], wires[Wire.BOTTOM]]),
    containsAll(segments.filter(s => s.length === 5), [wires[Wire.TOP], wires[Wire.TOP_RIGHT], wires[Wire.MIDDLE], wires[Wire.BOTTOM_RIGHT], wires[Wire.BOTTOM]]),
    containsAll(segments.filter(s => s.length === 4), [wires[Wire.TOP_LEFT], wires[Wire.TOP_RIGHT], wires[Wire.MIDDLE], wires[Wire.BOTTOM_RIGHT]]),
    containsAll(segments.filter(s => s.length === 5), [wires[Wire.TOP], wires[Wire.TOP_LEFT], wires[Wire.MIDDLE], wires[Wire.BOTTOM_RIGHT], wires[Wire.BOTTOM]]),
    containsAll(segments.filter(s => s.length === 6), [wires[Wire.TOP], wires[Wire.TOP_LEFT], wires[Wire.MIDDLE], wires[Wire.BOTTOM_RIGHT], wires[Wire.BOTTOM_LEFT], wires[Wire.BOTTOM]]),
    containsAll(segments.filter(s => s.length === 3), [wires[Wire.TOP], wires[Wire.TOP_RIGHT], wires[Wire.BOTTOM_RIGHT]]),
    containsAll(segments.filter(s => s.length === 7), [wires[Wire.TOP], wires[Wire.TOP_LEFT], wires[Wire.TOP_RIGHT], wires[Wire.MIDDLE], wires[Wire.BOTTOM_LEFT], wires[Wire.BOTTOM_RIGHT], wires[Wire.BOTTOM]]),
    containsAll(segments.filter(s => s.length === 6), [wires[Wire.TOP], wires[Wire.TOP_LEFT], wires[Wire.TOP_RIGHT], wires[Wire.MIDDLE], wires[Wire.BOTTOM_RIGHT], wires[Wire.BOTTOM]]),
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
