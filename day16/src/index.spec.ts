import 'mocha';
import {expect} from 'chai';
import {hex2bin, part1, part2, readFile} from './index';

describe('AoC 2021: day16', function () {
  this.timeout(600000);

  it('hex2bin', () => {
      expect(hex2bin('8')).to.equal('1000');
      expect(hex2bin('F')).to.equal('1111');
      expect(hex2bin('EE00D40C823060')).to.equal('11101110000000001101010000001100100000100011000001100000');
      expect(hex2bin('8A004A801A8002F478')).to.equal('100010100000000001001010100000000001101010000000000000101111010001111000');
      expect(hex2bin('620080001611562C8802118E34')).to.equal('01100010000000001000000000000000000101100001000101010110001011001000100000000010000100011000111000110100');
      expect(hex2bin('C0015000016115A2E0802F182340')).to.equal('1100000000000001010100000000000000000001011000010001010110100010111000001000000000101111000110000010001101000000');
      expect(hex2bin('A0016C880162017C3686B18A3D4780')).to.equal('101000000000000101101100100010000000000101100010000000010111110000110110100001101011000110001010001111010100011110000000');
    }
  );

  it('part1 examples', () => {
    expect(part1('D2FE28'), 'part1: D2FE28').to.equal(6);
    expect(part1('38006F45291200'), 'part1: 38006F45291200').to.equal(9);
    expect(part1('EE00D40C823060'), 'part1: EE00D40C823060').to.equal(14);
    expect(part1('8A004A801A8002F478'), 'part1: 8A004A801A8002F478').to.equal(16);
    expect(part1('620080001611562C8802118E34'), 'part1: 620080001611562C8802118E34').to.equal(12);
    expect(part1('C0015000016115A2E0802F182340'), 'part1: C0015000016115A2E0802F182340').to.equal(23);
    expect(part1('A0016C880162017C3686B18A3D4780'), 'part1: A0016C880162017C3686B18A3D4780').to.equal(31);
  });

  it('part1', () => {
    expect(part1(readFile('input.txt')), 'part1: input.txt').to.equal(875);
  });

  it('part2 examples', () => {
    expect(part2('C200B40A82'), 'part1: C200B40A82').to.equal(3);
    expect(part2('04005AC33890'), 'part1: 04005AC33890').to.equal(54);
    expect(part2('880086C3E88112'), 'part1: 880086C3E88112').to.equal(7);
    expect(part2('CE00C43D881120'), 'part1: CE00C43D881120').to.equal(9);
    expect(part2('D8005AC2A8F0'), 'part1: D8005AC2A8F0').to.equal(1);
    expect(part2('F600BC2D8F'), 'part1: F600BC2D8F').to.equal(0);
    expect(part2('9C005AC2F8F0'), 'part1: 9C005AC2F8F0').to.equal(0);
    expect(part2('9C0141080250320F1802104A08'), 'part1: 9C0141080250320F1802104A08').to.equal(1);
  });

  it('part2', () => {
    expect(part2(readFile('input.txt')), 'part2: input.txt').to.equal(1264857437203);
  });
});
