import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

describe('AoC 2021: day15', function () {
  this.timeout(60000);

  it('part1', () => {
    expect(part1(readFile('input.example.txt')), 'part1: input.example.txt').to.equal(40);
    expect(part1(readFile('input.txt')), 'part1: input.txt').to.equal(613);
  });

  it('part2', () => {
    expect(part2(readFile('input.example.txt')), 'part2: input.example.txt').to.equal(42);
    expect(part2(readFile('input.txt')), 'part2: input.txt').to.equal(42);
  });
});
