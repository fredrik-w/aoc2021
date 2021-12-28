import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

describe('AoC 2021: day17', function () {

  it('part1', () => {
    expect(part1(readFile('input.example.txt')), 'part1: input.example.txt').to.equal(45);
    expect(part1(readFile('input.txt')), 'part1: input.txt').to.equal(12090);
  });

  it('part2', () => {
    expect(part2(readFile('input.example.txt')), 'part2: input.example.txt').to.equal(112);
    expect(part2(readFile('input.txt')), 'part2: input.txt').to.equal(5059);
  });
});
