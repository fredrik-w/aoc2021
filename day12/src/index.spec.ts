import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

it('AoC 2021: day12', () => {
  expect(part1(readFile('input.training.txt')), 'part1: input.training.txt').to.equal(10);
  expect(part1(readFile('input.small.example.txt')), 'part1: input.small.example.txt').to.equal(19);
  expect(part1(readFile('input.example.txt')), 'part1: input.example.txt').to.equal(226);
  expect(part1(readFile('input.txt')), 'part1: input.txt').to.equal(4659);
  expect(part2(readFile('example-input.txt')), 'part2: example-input.txt').to.equal(42);
  expect(part2(readFile('input.txt')), 'part2: example.txt').to.equal(42);
});
