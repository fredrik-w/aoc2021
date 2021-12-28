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
      let chunk: string = '';

      while (!(chunk = binary.substring(position, position + 5)).startsWith('0')) {
        values.push(chunk);
        position += 5;
      }
      values.push(chunk);
      position += 5;
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

const packetVersions = (packet: Packet): number => {
  if (packet.subPackets.length > 0) {
    return packet.header.version + packet.subPackets.map(p => packetVersions(p)).reduce((sum, v) => sum + v, 0);
  }
  return packet.header.version;
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
  const { packet, } = parse(hex2bin(input));
  return packetVersions(packet);
};


export const part2 = (input: string): number => {
  return -1;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));

