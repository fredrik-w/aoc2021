import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

it('AoC 2021: day05', () => {
  expect(part1(readFile('example-input.txt')), 'part1: example-input.txt').to.equal(5);
  expect(part1(readFile('input.txt')), 'part1: input.txt').to.equal(4826);
  expect(part2(readFile('example-input.txt')), 'part2: example-input.txt').to.equal(12);
  expect(part2(readFile('input.txt')), 'part2: example.txt').to.equal(16793);
});
