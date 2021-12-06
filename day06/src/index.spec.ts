import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

describe('day06', () => {
  it('part1 should be correct', () => {
    expect(part1(readFile('example-input.txt'))).to.equal(5934);
    expect(part1(readFile('input.txt'))).to.equal(387413);
  })

  it('part2 should be correct', () => {
    expect(part2(readFile('example-input.txt'))).to.equal(-1);
    expect(part2(readFile('input.txt'))).to.equal(-1);
  })
});
