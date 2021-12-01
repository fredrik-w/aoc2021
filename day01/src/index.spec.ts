import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

describe('day01', () => {
  it('part1 should match the example', () => {
    const lines = readFile('example-input.txt');
    expect(part1(lines)).to.equal(7);
  })

  it('part2 should match the example', () => {
    const lines = readFile('example-input.txt');
    expect(part2(lines)).to.equal(5);
  });
});
