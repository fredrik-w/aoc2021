import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

describe('day02', () => {
  it('part1 should match the example', () => {
    expect(part1(readFile('example-input.txt'))).to.equal(150);
  })

  it('part1 should be correct', () => {
    expect(part1(readFile('input.txt'))).to.equal(1670340);
  });

  it.skip('part2 should match the example', () => {
    expect(part2(readFile('example-input.txt'))).to.equal(5);
  });
});
