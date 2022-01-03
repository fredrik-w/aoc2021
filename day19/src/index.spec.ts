import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

describe('AoC 2021: day19', function () {
  it('part1', () => {
    expect(part1(readFile('input.example.txt')), 'part1: input.example.txt').to.equal(79);
    expect(part1(readFile('input.txt')), 'part1: input.txt').to.equal(3411);
  });

  it('part2', () => {
    expect(part2(readFile('input.example.txt')), 'part2: input.example.txt').to.equal(3993);
    expect(part2(readFile('input.txt')), 'part2: input.txt').to.equal(4680);
  });
});
