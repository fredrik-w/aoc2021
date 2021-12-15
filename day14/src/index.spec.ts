import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

describe('AoC 2021: day14', () => {
  it('part1', () => {
    expect(part1(readFile('input.example.txt')), 'part1: input.example.txt').to.equal(1588);
    expect(part1(readFile('input.txt')), 'part1: input.txt').to.equal(2345);
  });

  it('part2', () => {
    expect(part2(readFile('input.example.txt')), 'part2: input.example.txt').to.equal(2188189693529);
    expect(part2(readFile('input.txt')), 'part2: input.txt').to.equal(2432786807053);
  });
});
