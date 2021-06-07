import { probability } from '../utils/probability.utils.js';

export class GameService {
  constructor() {
    this.size = {
      width: 0,
      height: 0,
    };

    this.borderless = false;
    
    this._cells = null;
    this._generation = 0;
    this._numberOfMutations = 0;
  }

  get cells() {
    return this._flattenCells(this._cells);
  }

  set cells(cells) {
    this._cells = cells;
  }

  get generation() {
    return this._generation;
  }

  set generation(value) {
    this._generation = value;
  }

  get numberOfMutations() {
    return this._numberOfMutations;
  }

  set numberOfMutations(value) {
    this._numberOfMutations = value;
  }
  

  create(settings = {
    size: {
      width: 30,
      height: 30,
    },
    borderless: false,
  }) {
    this.size = settings.size;
    this.borderless = settings.borderless;
    return this;
  }

  next() {
    const nextGeneration = [];

    for (let i = 0; i < 30; i++) {
      nextGeneration[i] = [];
      for (let j = 0; j < 30; j++) {
        const cell = this._cells[i][j];

        let neighbors = [
          this._cells[this._normalizeTopLeftFieldPoint(i) - 1][j],
          this._cells[i][this._normalizeBottomRightPoint(j) + 1],
          this._cells[this._normalizeBottomRightPoint(i) + 1][j],
          this._cells[i][this._normalizeTopLeftFieldPoint(j) - 1],
          this._cells[this._normalizeTopLeftFieldPoint(i) - 1][this._normalizeBottomRightPoint(j) + 1],
          this._cells[this._normalizeBottomRightPoint(i) + 1][this._normalizeBottomRightPoint(j) + 1],
          this._cells[this._normalizeBottomRightPoint(i) + 1][this._normalizeTopLeftFieldPoint(j) - 1],
          this._cells[this._normalizeTopLeftFieldPoint(i) - 1][this._normalizeTopLeftFieldPoint(j) - 1],
        ];

        neighbors = neighbors.filter((n) => n.isAlive);

        // Стандартные правила игры жизнь
        let isAlive;

        const location = {
          x: j,
          y: i,
        };

        if ((neighbors.length == 2 || neighbors.length == 3) && cell.isAlive) {
          isAlive = true;
          nextGeneration[i][j] = this._createNewCell(location, isAlive);
        } else {
          isAlive = false;
          nextGeneration[i][j] = this._createNewCell(location, isAlive);
        }

        if (neighbors.length == 2 && !cell.isAlive) {
          isAlive = true;
          const parent1 = neighbors[0];
          const parent2 = neighbors[1];
  
          nextGeneration[i][j] = this._createNewCell(location, isAlive, parent1, parent2);
        }
        
        // если опасная мутация, то клетка умирает
        if (cell.dna.isMutated && cell.dna.length === 5) {
          cell.isAlive = false;
        }
      }
    }

    this.generation += 1;
    this.cells = nextGeneration;
  }

  reset() {
    this.cells = null;
    this.generation = 0;
    this.numberOfMutations = 0;
  }

  random() {
    const cells = [];

    for (let i = 0; i < 30; i++) {
      cells[i] = [];
      for (let j = 0; j < 30; j++) {
        const isAlive = probability(50);
        const location = {
          x: j,
          y: i,
        };
        cells[i].push(this._createNewCell(location, isAlive));
      }
    }

    this.cells = cells;
  }

  _normalizeTopLeftFieldPoint(i) {
    // функция для тора если выходит вверх/влево за рамки
    if (i == 0) return 30;
    else return i;
  }

  _normalizeBottomRightPoint(i) {
    // функция для тора если выходит вниз/вправо за рамки
    if (i == 29) return -1;
    else return i;
  }

  _generateDna() {
    const dna = [];

    for (let i = 0; i < 4; i++) {
      dna.push(this._generateDnaPairs());
    }

    return dna;
  }

  _generateDnaPairs() {
    const nucleotides = ['A', 'T', 'C', 'G'];

    const pairs = {
      pairs: [],
      isDominant: probability(50)
    };

    for (let j = 0; j < 4; j++) {
      const pair = [];
      
      const first = nucleotides[Math.round(Math.random()*3)];

      pair.push(first);

      if (first === 'A') {
        pair.push('T');
      } else if (first === 'T') {
        pair.push('A');
      } else if (first === 'C') {
        pair.push('G');
      } else {
        pair.push('C');
      }

      pairs.pairs.push(pair);
    }
    
    return pairs;
  }

  _createNewCell(location, isAlive = true, parent1 = null, parent2 = null) {
    if (!parent1 && !parent2) {
      return {
        location,
        isAlive,
        born: this._generation,
        dna: this._generateDna(),
      }
    } else {
      return {
        location,
        isAlive: true,
        born: this._generation,
        parents: {
          1: parent1.dna,
          2: parent2.dna,
        },
        dna: this._createNewCellDna(parent1, parent2),
      }
    }
  }

  _createNewCellDna(parent1, parent2) {
    const dna = [];

    for (let i = 0; i < 4; i++) {
      if (parent1.dna[i].isDominant && !parent2.dna[i].isDominant) {
        dna.push(parent1.dna[i]);
      } else if (!parent1.dna[i].isDominant && parent2.dna[i].isDominant) {
        dna.push(parent2.dna[i]);
      } else {
        if (probability(50)) {
          dna.push(parent1.dna[i]);
        } else {
          dna.push(parent2.dna[i]);
        }
      }
    }

    if (this._isMutation()) {
      dna.isMutated = true;
      if (probability(50)) {
        const idx = Math.round(Math.random() * 3);
        dna[idx].pairs = dna[idx].pairs.reverse();
      } else {
        dna[4] = this._generateDnaPairs();
      }
    }

    return dna;
  }

  _isMutation() {
    return probability(5);
  }

  _flattenCells(cells) {
    const flattened = [];

    cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isAlive) {
          flattened.push(cell);
        }
      });
    })

    return flattened;
  }
}