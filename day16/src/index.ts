import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim();

export const hex2bin = (input: string): string => input.split('').map(s => parseInt(s, !isNaN(parseInt(s, 10)) ? 10 : 16).toString(2).padStart(4, '0')).join('');

const bin2int = (input: string): number => parseInt(input, 2);

class Header {
  public readonly version: number;
  public readonly typeId: number;
  public readonly lengthTypeId: number | undefined;

  constructor(raw: string) {
    this.version = bin2int(raw.substring(0, 3));
    this.typeId = bin2int(raw.substring(3, 6));
    this.typeId !== 4 && (this.lengthTypeId = bin2int(raw.substring(6, 7)));
  }
}

class Packet {
  constructor(public readonly header: Header, public readonly value?: number, public readonly subPackets: Packet[] = []) {
  }
}

const parse = (binary: string, position: number = 0): { packet: Packet, position: number } => {
  let packet: Packet|undefined;

  while (packet === undefined) {
    let header: Header = new Header(binary.substring(position, position + 7));
    position += 6;
    if (header.typeId === 4) {
      let values: string[] = [];
      while (position < binary.length) {
        values.push(binary.substring(position, (position += 5)));
        if (values[values.length - 1].startsWith('0')) {
          break;
        }
      }
      packet = new Packet(header, bin2int(values.map(v => v.substring(1)).join('')));
    } else {
      position++;
      let subPackets: Packet[] = [];
      if (header.lengthTypeId === 0) {
        let bitsLeftToRead = bin2int(binary.substring(position, (position += 15)));
        while (bitsLeftToRead > 0) {
          const {packet, position: read} = parse(binary.substring(position));
          bitsLeftToRead -= read;
          subPackets.push(packet);
          position += read;
        }
      } else {
        let packetsToRead = bin2int(binary.substring(position, (position += 11)));
        while (packetsToRead > 0) {
          const {packet, position: read} = parse(binary.substring(position));
          packetsToRead--;
          subPackets.push(packet);
          position += read;
        }
      }
      packet = new Packet(header, undefined, subPackets);
    }
  }

  return {packet: packet!, position}
}

const bitsCalculator = (packet: Packet): number => {
  switch (packet.header.typeId) {
    case 0: // sum
      return packet.subPackets.reduce((sum, p) => sum + bitsCalculator(p), 0);
    case 1: // product
      return packet.subPackets.reduce((sum, p) => sum * bitsCalculator(p), 1);
    case 2: // minimum
      return Math.min(...packet.subPackets.map(p => bitsCalculator(p)));
    case 3: // maximum
      return Math.max(...packet.subPackets.map(p => bitsCalculator(p)));
    case 4: // literal value
      return packet.value!;
    case 5: // greater-than
      return bitsCalculator(packet.subPackets[0]) > bitsCalculator(packet.subPackets[1]) ? 1 : 0;
    case 6: // less-than
      return bitsCalculator(packet.subPackets[0]) < bitsCalculator(packet.subPackets[1]) ? 1 : 0;
    case 7: // less-than
      return bitsCalculator(packet.subPackets[0]) === bitsCalculator(packet.subPackets[1]) ? 1 : 0;
    default:
      throw new Error('Illegal state');
  }
}

const print = (packet: Packet, level: number = 0): void => {
  let prefix = ' '.repeat(level);
  if (packet.subPackets.length > 0) {
    console.log(`${prefix}OperatorPacket[version ${packet.header.version}, typeId ${packet.header.typeId}, lengthTypeId ${packet.header.lengthTypeId}, #subPackets ${packet.subPackets.length}]`);
    packet.subPackets.forEach(p => print(p, level + 1));
  } else {
    console.log(`${prefix}LiteralPacket[version ${packet.header.version}, typeId ${packet.header.typeId}, value ${packet.value}]`);
  }
}

export const part1 = (input: string): number => {
  const packetVersions = (packet: Packet): number => packet.header.version + packet.subPackets.map(p => packetVersions(p)).reduce((sum, v) => sum + v, 0);

  const { packet, } = parse(hex2bin(input));
  return packetVersions(packet);
};


export const part2 = (input: string): number => {
  const { packet, } = parse(hex2bin(input));
  return bitsCalculator(packet);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

