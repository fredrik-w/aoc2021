import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

describe('day02', () => {
  it('part1 should be correct', () => {
    expect(part1(readFile('example-input.txt'))).to.equal(198);
    expect(part1(readFile('input.txt'))).to.equal(2743844);
  })

  it('part2 should be correct', () => {
    expect(part2(readFile('example-input.txt'))).to.equal(230);
    expect(part2(readFile('input.txt'))).to.equal(-1);
  });
});
