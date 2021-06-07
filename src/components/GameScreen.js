import { AbstractComponent } from './core/AbstractComponent.js';

export class GameScreen extends AbstractComponent {
  constructor(props = { cells: [] }, listeners = {}) {
    super(props, listeners);

    this._id = props.id || `game-screen-${this._uid}`;

    this._ctx = null;
  }

  render() {
    const div = document.createElement('div');
    div.id = this._id;
    const canvas = document.createElement('canvas');
    canvas.id = 'field';
    canvas.width = 300;
    canvas.height = 300;
    const self = this;
    canvas.onclick = (event) => {
      const x = event.offsetX;
      const y = event.offsetY;

      const clickedCell = self.props.cells.find((cell) => self._isCellInPath(cell, x, y));

      if (clickedCell) {
        this._handleCellClick(clickedCell);
      } else {
        this._handleCellClick(null);
      }
    };

    this._ctx = canvas.getContext("2d");;
    
    div.appendChild(canvas);
    
    return div;
  }

  _handleCellClick(cell) {
    if (typeof this.listeners.cellClick === 'function') {
      this.listeners.cellClick(cell)
    }
  }

  _isCellInPath(cell, x, y) {
    var halfWidth = 10 / 2;
    var halfHeight =  10 / 2;

    var diffX = Math.abs(cell.location.x * 10 - x);
    var diffY = Math.abs(cell.location.y * 10 - y);

    var isInXaxes = diffX < halfWidth; 
    var isInYaxes = diffY < halfHeight; 
    
    return isInXaxes && isInYaxes;
  }

  update() {
    this._draw();
  }

  _draw() {
    this._ctx.clearRect(0, 0, 300, 300);
    this.props.cells.forEach((cell) => {
      this._ctx.fillRect(cell.location.x * 10, cell.location.y * 10, 10, 10);
      this._ctx.fillStyle = cell.dna.isMutated ? '#ff3c00' : "#4D6B75";
    })
  }
}
