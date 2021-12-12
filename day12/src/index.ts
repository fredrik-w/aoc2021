import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n').map(line => line.split('-'));

const addPath = (collection: Map<string, string[]>, path: string[]): void => {
  !collection.has(path[0]) && collection.set(path[0], []);
  !collection.has(path[1]) && collection.set(path[1], []);
  collection.get(path[0])!.push(path[1]);
  collection.get(path[1])!.push(path[0]);
}

const isSmallCave = (value: string): boolean => value === value.toLocaleLowerCase();

const explore = (cave: Map<string, string[]>, visited: string[], current: string, routes: string[], doubleVisitOnce: boolean = false): void => {
  let paths = cave.get(current)!.filter(p => p !== 'start');
  visited.push(current);
  if (current === 'end' || paths.length === 0) {
    current === 'end' && routes.push(visited.join(','));
    return;
  }

  for (let path of paths) {
    if (path === visited[visited.length - 1]) {
      continue;
    }
    if (isSmallCave(path) && visited.includes(path)) {
      const small = visited.filter(p => isSmallCave(p));
      if (!doubleVisitOnce || new Set(small).size !== small.length) {
        continue;
      }
    }
    explore(cave, visited.slice(), path, routes, doubleVisitOnce);
  }
  return;
}

const exploreCave = (paths: string[][], doubleVisitOnce: boolean): number => {
  const cave: Map<string, string[]> = new Map();
  paths.forEach(path => addPath(cave, path));
  let routes: string[] = [];
  explore(cave, [], 'start', routes, doubleVisitOnce);
  return routes.length;
}

export const part1 = (paths: string[][]): number => {
  return exploreCave(paths, false);
}


export const part2 = (paths: string[][]): number => {
  return exploreCave(paths, true);
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
