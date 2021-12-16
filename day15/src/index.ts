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

  constructor() {
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
      let current = pq.dequeue();
      current.node.getEdges().forEach(neighbour => {
        let time = times.get(current.node)! + neighbour.weight;
        if (time < times.get(neighbour)!) {
          times.set(neighbour, time);
          backtrace.set(neighbour, current.node);
          pq.enqueue(new WeightedNode(neighbour, time));
        }
      });
    }

    return times.get(end)!;
  }
}

const parse = (lines: string[]) => {
  const raw = lines.map(line => line.split('').map(s => +s));

  const findNeighbours = (cave: number[][], row: number, col: number): Node[] => {
    let neighbours: Node[] = [];
    col > 0 && neighbours.push(new Node(row, col - 1, cave[row][col - 1]));
    row > 0 && neighbours.push(new Node(row - 1, col, cave[row - 1][col]));
    col < cave[row].length - 1 && neighbours.push(new Node(row, col + 1, cave[row][col + 1]));
    row < cave.length - 1 && neighbours.push(new Node(row + 1, col, cave[row + 1][col]));
    return neighbours;
  }

  const cave = new Cave();

  for (let x = 0; x < raw.length; x++) {
    for (let y = 0; y < raw[0].length; y++) {
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
  const cave = parse(lines);
  return cave.findShortestPath(cave.getNodes()[0], cave.getNodes()[cave.getNodes().length-1]);
};

export const part2 = (lines: string[]): number => {
  return -1;
}

require.main === module && console.log((process.env.part === 'part2' ? part2 : part1)(readFile('input.txt')));
