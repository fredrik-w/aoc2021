import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().split('\n');

interface Comparable<T> {
  compareTo(other: T): boolean;
}

class ComparableKeyMap<K extends Comparable<K>, V> extends Map<K, V> {
  private findKey = (key: K): K | undefined => [...this.keys()].filter(k => key.compareTo(k)).pop();

  delete(key: K): boolean {
    const k = this.findKey(key);
    return k !== undefined ? super.delete(k) : false;
  }

  get(key: K): V | undefined {
    const k = this.findKey(key);
    return k !== undefined ? super.get(k) : undefined;
  }

  has(key: K): boolean {
    const k = this.findKey(key);
    return k !== undefined ? super.has(k) : false;
  }

  set(key: K, value: V): this {
    return super.set(this.findKey(key) || key, value);
  }
}

class UniqueArray<T extends Comparable<T>> extends Array<T> {
  includes(searchElement: T, fromIndex?: number): boolean {

    return super.includes(searchElement, fromIndex);
  }

  push(...items: T[]): number {
    return super.push(...items);
  }
}

type BeaconToBeacon = {
  src: Beacon;
  dst: Beacon;
  x: number;
  y: number;
  z: number;
}

type CoordinateMap = {
  x: 'x'|'y'|'z';
  y: 'x'|'y'|'z';
  z: 'x'|'y'|'z';
}

type ScannerBeaconMapping = {
  src: Scanner,
  dst: Scanner,
  mapping: Map<Beacon, Beacon>
  coordinateMap: CoordinateMap
}

class Beacon implements Comparable<Beacon> {
  constructor(public readonly x: number, public readonly y: number, public readonly z: number) {}

  toString = (): string => `Beacon[${this.x},${this.y},${this.z}]`;

  compareTo = (other: Beacon): boolean => this.x === other.x && this.y === other.y && this.z === other.z;
}

class Scanner {
  public readonly distanceMap: BeaconToBeacon[];
  constructor(public readonly label: string, public readonly beacons: Beacon[]) {
    this.distanceMap = Scanner.calculateDistances(this.beacons);
  }

  static calculateDistances = (beacons: Beacon[]): BeaconToBeacon[] => {
    let map: BeaconToBeacon[] = [];
    for (let i = 0; i < beacons.length; i++) {
      for (let j = i+1; j < beacons.length; j++) {
          const src = beacons[i];
          const dst = beacons[j];
          map.push({src, dst, x: Math.abs(src.x - dst.x), y: Math.abs(src.y - dst.y), z: Math.abs(src.z - dst.z)});
      }
    }
    return map;
  }
}

const parse = (input: string[]): Scanner[] => {
  let label: string = '';
  let beacons: Beacon[] = [];
  let scanners: Scanner[] = [];

  for (const line of input) {
    if (line.startsWith('---')) {
      label = line.replaceAll('---', '').trim();
    } else if (line.length === 0) {
      scanners.push(new Scanner(label, beacons));
      label = '';
      beacons = [];
    } else {
      beacons.push(new Beacon(...line.split(',').map(v => +v) as [number, number, number]));
    }
  }

  return scanners;
}

const commonBeacons = (a: Scanner, b: Scanner): Map<Beacon, Beacon> => {
  const compare = (a: BeaconToBeacon, b: BeaconToBeacon): boolean => (a.x * a.y * a.z) === (b.x * b.y * b.z);

  const beacons: Map<Beacon, Beacon[]> = new ComparableKeyMap();

  a.distanceMap.forEach(b1 => {
    let match = b.distanceMap.filter(b2 => compare(b1, b2));
    if (match.length === 1) {
      const b2 = match.pop()!;
// console.log('distanceMap', b1, b2);
      !beacons.has(b1.src) && beacons.set(b1.src, []);
      !beacons.has(b1.dst) && beacons.set(b1.dst, []);
      beacons.get(b1.src)!.push(b2.src, b2.dst);
      beacons.get(b1.dst)!.push(b2.src, b2.dst);
    }
  });

  const scannerBeaconMapping: Map<Beacon, Beacon> = new Map();
  for (const [beaconA, candidates] of beacons.entries()) {
    let occurrences: Map<Beacon, number> = new ComparableKeyMap();
    candidates.forEach(b => occurrences.set(b, (occurrences.get(b) || 0 ) + 1));
    const beaconB = [...occurrences.entries()].filter(([b, count]) => count === Math.max(...occurrences.values())).map(([b, count]) => b).pop()!;
    scannerBeaconMapping.set(beaconA, beaconB);
  }

  return scannerBeaconMapping;
}

const scannerBeaconCoordinatesMapping = (a: Scanner, b: Scanner, mapping: Map<Beacon, Beacon>): CoordinateMap => {
  const beaconMap: Beacon[][] = [...mapping.entries()];
  const { x: ax, y: ay, z: az } = a.distanceMap.filter(b2b => (b2b.src.compareTo(beaconMap[0][0]) && b2b.dst.compareTo(beaconMap[1][0])) || (b2b.dst.compareTo(beaconMap[0][0]) && b2b.src.compareTo(beaconMap[1][0]))).pop()!;
  const { x: bx, y: by, z: bz } = b.distanceMap.filter(b2b => (b2b.src.compareTo(beaconMap[0][1]) && b2b.dst.compareTo(beaconMap[1][1])) || (b2b.dst.compareTo(beaconMap[0][1]) && b2b.src.compareTo(beaconMap[1][1]))).pop()!;

  return { x: ax === bx ? 'x' : ax === by ? 'y' : 'z', y: ay === by ? 'y' : ay === bx ? 'x' : 'z', z: az === bz ? 'z' : az === by ? 'y' : 'x' }
}

const scannerMapping = (input: string[]): ScannerBeaconMapping[] => {
  const scanners = parse(input);
  const map: ScannerBeaconMapping[] = [];
  for (let i=0; i<scanners.length; i++) {
    for (let j=i+1; j<scanners.length; j++) {
      const mapping = commonBeacons(scanners[i], scanners[j]);
      mapping.size >= 12 && map.push({src: scanners[i], dst: scanners[j], mapping, coordinateMap: scannerBeaconCoordinatesMapping(scanners[i], scanners[j], mapping)});
    }
  }
  return map;
}

export const part1 = (input: string[]): number => {
  const map = scannerMapping(input);
console.log(map);
  return -1;
}

export const part2 = (input: string[]): number => {
  return -1;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
