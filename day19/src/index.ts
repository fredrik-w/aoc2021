import fs from 'fs';
import {Key} from 'readline';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().split('\n');

interface Comparable<T> {
  compareTo(other: T): boolean;
}

class ComparableKeyMap<K extends Comparable<K>, V> extends Map<K, V> {
  private findKey = (key: K): K | undefined => [...this.keys()].filter(k => key.compareTo(k)).pop();

  delete(key: K): boolean {
    const k = this.findKey(key);
    return k === undefined ? false : super.delete(k);
  }

  get(key: K): V | undefined {
    const k = this.findKey(key);
    return k !== undefined ? super.get(k) : undefined;
  }

  has(key: K): boolean {
    const k = this.findKey(key);
    return k === undefined ? false : super.has(k);
  }

  set(key: K, value: V): this {
    return super.set(this.findKey(key) || key, value);
  }
}

type BeaconToBeacon = {
  src: Beacon;
  dst: Beacon;
  x: number;
  y: number;
  z: number;
}

type ScannerBeaconMapping = {
  src: Scanner,
  dst: Scanner,
  mapping: Map<Beacon, Beacon>
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
  // const compare = (a: BeaconToBeacon, b: BeaconToBeacon): boolean => a.x === b.x && a.y === b.y && a.z === b.z;
  // const compare = (a: BeaconToBeacon, b: BeaconToBeacon): boolean => [a.x, a.y, a.z].every(v => [b.x, b.y, b.z].includes(v));
  const compare = (a: BeaconToBeacon, b: BeaconToBeacon): boolean => (a.x * a.y * a.z) === (b.x * b.y * b.z);

  const beacons: Map<Beacon, Beacon[]> = new ComparableKeyMap();
  const scannerBeaconMapping: Map<Beacon, Beacon> = new Map();

  a.distanceMap.forEach(b1 => {
    let match = b.distanceMap.filter(b2 => compare(b1, b2));
    if (match.length === 1) {
      const b2= match.pop()!;
      !beacons.has(b1.src) && beacons.set(b1.src, []);
      !beacons.has(b1.dst) && beacons.set(b1.dst, []);
      beacons.get(b1.src)!.push(b2.src, b2.dst);
      beacons.get(b1.dst)!.push(b2.src, b2.dst);
    }
  });

  for (const [beaconA, candidates] of beacons.entries()) {
    let occurances: Map<Beacon, number> = new ComparableKeyMap();
    candidates.forEach(b => {
      !occurances.has(b) && occurances.set(b, 0);
      occurances.set(b, occurances.get(b)!+1);
    });
    const match = Math.max(...occurances.values());
    const beaconB = [...occurances.entries()].filter(([b, count]) => count === match).map(([b, count]) => b).pop()!;
    scannerBeaconMapping.set(beaconA, beaconB);
  }

  return scannerBeaconMapping;
}

export const part1 = (input: string[]): number => {
  const scanners = parse(input);
  const scannerMapping: ScannerBeaconMapping[] = [];
  for (let i=0; i<scanners.length; i++) {
    for (let j=i+1; j<scanners.length; j++) {
      const mapping = commonBeacons(scanners[i], scanners[j]);
      mapping.size >= 12 && scannerMapping.push({src: scanners[i], dst: scanners[j], mapping});
    }
  }
console.log(scannerMapping);
  return -1;
}

export const part2 = (input: string[]): number => {
  return -1;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
