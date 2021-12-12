import 'mocha';
import {expect} from 'chai';
import {part1, part2, readFile} from './index';

it('AoC 2021: day03', () => {
  expect(part1(readFile('input.example.txt')), 'part1: input.example.txt').to.equal(198);
  expect(part1(readFile('input.txt')), 'part1: input.txt').to.equal(2743844);
  expect(part2(readFile('input.example.txt')), 'part2: input.example.txt').to.equal(230);
  expect(part2(readFile('input.txt')), 'part2: example.txt').to.equal(6677951);
});

