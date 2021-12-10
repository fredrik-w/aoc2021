import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

it('AoC 2021: day09', () => {
  expect(part1(readFile('example-input.txt')), 'part1: example-input.txt').to.equal(15);
  expect(part1(readFile('input.txt')), 'part1: input.txt').to.equal(444);
  expect(part2(readFile('example-input.txt')), 'part2: example-input.txt').to.equal(1134);
  expect(part2(readFile('input.txt')), 'part2: example.txt').to.equal(1168440);
});
