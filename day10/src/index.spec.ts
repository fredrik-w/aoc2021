import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

it('AoC 2021: day10', () => {
  expect(part1(readFile('input.example.txt')), 'part1: input.example.txt').to.equal(26397);
  expect(part1(readFile('input.txt')), 'part1: input.txt').to.equal(345441);
  expect(part2(readFile('input.example.txt')), 'part2: input.example.txt').to.equal(288957);
  expect(part2(readFile('input.txt')), 'part2: example.txt').to.equal(3235371166);
});
