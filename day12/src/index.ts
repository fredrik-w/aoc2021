import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

const addPath = (collection: Map<string, string[]>, path: string[]): void => {
  !collection.has(path[0]) && collection.set(path[0], []);
  !collection.has(path[1]) && collection.set(path[1], []);
  collection.get(path[0])!.push(path[1]);
  collection.get(path[1])!.push(path[0]);
}

const isSmallCave = (value: string): boolean => value === value.toLocaleLowerCase();

const explore = (cave: Map<string, string[]>, visited: string[], current: string, routes: string[]): void => {
  let paths = cave.get(current)!.filter(p => p !== 'start' && !(isSmallCave(p) && visited.includes(p)));// && (visited.length > 0 && p !== visited[visited.length-1]));
  visited.push(current);
  if (current === 'end' || paths.length === 0) {
    routes.push(visited.join(','));
    return;
  }

  for (let path of paths) {
    if (path === visited[visited.length-1]) {
      continue;
    }
    explore(cave, visited.slice(), path, routes);
  }
}

export const part1 = (lines: string[]): number => {
  const cave: Map<string, string[]> = new Map();
  lines.map(line => line.split('-')).forEach(path => addPath(cave, path));
  let routes: string[] = [];
  explore(cave, [], 'start', routes);
  return routes.filter(r => r.endsWith(',end')).length;
}


export const part2 = (lines: string[]): number => {
  return -1
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
