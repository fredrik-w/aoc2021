import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

describe('day05', () => {
  it('part1 should be correct', () => {
    expect(part1(readFile('example-input.txt'))).to.equal(5);
    expect(part1(readFile('input.txt'))).to.equal(4826);
  })

  it('part2 should be correct', () => {
    expect(part2(readFile('example-input.txt'))).to.equal(12);
    expect(part2(readFile('input.txt'))).to.equal(16793);
  })
});
