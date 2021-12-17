import fs from 'fs';

export const readFile = (filename: string) => fs.readFileSync(filename).toString().trim().split('\n');

class Node {
  private edges: Node[] = [];

  constructor(public readonly x: number, public readonly y: number, public readonly weight: number) {
  }

  public addEdge = (edge: Node): void => {
    if (this.edges.find(e => equals(e, edge)) === undefined) {
      this.edges.push(edge);
    }
  }

  public getEdges = (): Node[] => this.edges;
}

class WeightedNode {
  constructor(public readonly node: Node, public readonly weight: number) { }
}

class PriorityQueue {
  private collection: WeightedNode[] = [];

  constructor() {
  }

  public enqueue = (element: WeightedNode): void => {
    const index = this.collection.findIndex(v => element.weight < v.weight);
    index === -1 ? this.collection.push(element) : this.collection.splice(index - 1, 0, element);
  }

  public dequeue = (): WeightedNode => this.collection.shift()!;
  public isEmpty = (): boolean => this.collection.length === 0;
}


const equals = (a: Node, b: Node): boolean => a.x === b.x && a.y === b.y;

class Cave {
  private nodes: Node[] = [];

  constructor(public readonly maxX: number, public readonly maxY: number) {
  }

  public addNode = (node: Node) => {
    if (this.nodes.find(n => equals(n, node)) === undefined) {
      this.nodes.push(node);
    }
  }

  public findNode = (node: Node): Node => this.nodes.find(n => equals(n, node))!;

  public addEdge = (a: Node, b: Node) => {
    const nodeA = this.findNode(a);
    const nodeB = this.findNode(b)
    nodeA.addEdge(nodeB);
    nodeB.addEdge(nodeA);
  }

  public getNodes = (): Node[] => this.nodes;

  public findShortestPath = (start: Node, end: Node): number => {
    const pq = new PriorityQueue();
    let times: Map<Node, number> = new Map();
    let backtrace: Map<Node, Node> = new Map();

    this.nodes.forEach(node => times.set(node, node !== start ? Infinity : 0));

    pq.enqueue(new WeightedNode(start, 0));

    while (!pq.isEmpty()) {
      let { node: current } = pq.dequeue();
      current.getEdges().forEach(neighbour => {
        let time = times.get(current)! + neighbour.weight;
        if (time < times.get(neighbour)!) {
          times.set(neighbour, time);
          backtrace.set(neighbour, current);
          pq.enqueue(new WeightedNode(neighbour, time));
        }
      });
    }

    return times.get(end)!;
  }
}

const findNeighbours = (cave: number[][], row: number, col: number): Node[] => {
  let neighbours: Node[] = [];
  col > 0 && neighbours.push(new Node(row, col - 1, cave[row][col - 1]));
  row > 0 && neighbours.push(new Node(row - 1, col, cave[row - 1][col]));
  col < cave[row].length - 1 && neighbours.push(new Node(row, col + 1, cave[row][col + 1]));
  row < cave.length - 1 && neighbours.push(new Node(row + 1, col, cave[row + 1][col]));
  return neighbours;
}

const toMatrix = (lines: string[]): number[][] => lines.map(line => line.split('').map(s => +s));

const parse = (raw: number[][]): Cave  => {
  const cave = new Cave(raw.length, raw[0].length);

  for (let x = 0, maxX = raw.length; x < maxX; x++) {
    for (let y = 0, maxY = raw[0].length; y < maxY; y++) {
      let a = new Node(x, y, raw[x][y]);
      cave.addNode(a);
      for (let b of findNeighbours(raw, x, y)) {
        cave.addNode(b);
        cave.addEdge(a, b);
      }
    }
  }

  return cave;
}

export const part1 = (lines: string[]): number => {
  const cave = parse(toMatrix(lines));
  return cave.findShortestPath(cave.getNodes()[0], cave.getNodes()[cave.getNodes().length-1]);
};

export const part2 = (lines: string[]): number => {
  const calculateNewValue = (value: number, iteration: number) => {
    const newValue = (value + iteration) % 9;
    return newValue == 0 ? 9 : newValue;
  }

  let cave = parse(toMatrix(lines));

  const maxX = cave.maxX;
  const maxY = cave.maxY;
  let adjustedMaxX = maxX;
  let adjustedMaxY = maxY;
  let bigCave: number[][] = new Array(maxX*5).fill('0').map(_ => new Array(maxY*5).fill('0'));
  cave.getNodes().slice().forEach(n => {
    bigCave[n.x][n.y] = n.weight;
    for (let i=0; i<5; i++) {
      for (let j=0; j<5; j++) {
        const xAdjustment = (maxX) * i;
        const yAdjustment = (maxY) * j;

        const adjustedNode = new Node(n.x + xAdjustment, n.y + yAdjustment, calculateNewValue(n.weight, (i+j)));
        bigCave[adjustedNode.x][adjustedNode.y] = adjustedNode.weight;
        // adjustedNode.x > adjustedMaxX && (adjustedMaxX = adjustedNode.x);
        // adjustedNode.y > adjustedMaxY && (adjustedMaxY = adjustedNode.y);

        cave.addNode(adjustedNode);
/*
        for (let e of n.getEdges()) {
          const adjustedEdge = new Node(e.x + xAdjustment, e.y + yAdjustment, calculateNewValue(e.weight, (i+j)));
          cave.addNode(adjustedEdge);
          cave.addEdge(adjustedNode, adjustedEdge)
        }
        if (xAdjustment % maxX === 0 || yAdjustment % maxY === 0) {
//console.log(`even X (original node ${n.x},${n.y}), ${xAdjustment}, ${maxX}, adjusted node ${adjustedNode.x},${adjustedNode.y}`);
//console.log(`even Y (original node ${n.x},${n.y}), ${xAdjustment}, ${maxX}, adjusted node ${adjustedNode.x},${adjustedNode.y}`);
          n.addEdge(adjustedNode);
        }
        */
      }
    }
  });

  cave = parse(bigCave);
console.log('parsed bigCave');
  return cave.findShortestPath(cave.getNodes()[0], cave.getNodes()[cave.getNodes().length-1]);
  /*
  const end = cave.getNodes().filter(n => n.x === adjustedMaxX && n.y === adjustedMaxY)[0];
// console.log('start', cave.getNodes()[0], 'end', cave.getNodes()[cave.getNodes().length-1]);
  return cave.findShortestPath(cave.getNodes()[0], end);
  */
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
