import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

describe('day04', () => {
  it('part1 should be correct', () => {
    expect(part1(readFile('example-input.txt'))).to.equal(4512);
    expect(part1(readFile('input.txt'))).to.equal(39984);
  })

  it('part2 should be correct', () => {
    expect(part2(readFile('example-input.txt'))).to.equal(1924);
    expect(part2(readFile('input.txt'))).to.equal(8468);
  })
});
