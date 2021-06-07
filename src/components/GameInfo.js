import { AbstractComponent } from "./core/AbstractComponent.js"

export class GameInfo extends AbstractComponent {
  constructor(props = {}, listeners = {}) {
    super(props, listeners);

    this._id = props.id || `game-info-${this._uid}`;
  }

  template() {
    
    return `
      <div class="all-stats">
        <div class="stat">
          <p>Итерация:</p>
          <span id="numberOfGenerations" style="color: #8854aa">${this.props.info.generation}</span>
        </div>
        <div class="stat">
          <p>Живых клеток:</p>
          <span id="aliveСellsQuantity" style="color: #1ac044">${this.props.info.cellsAlive}</span>
        </div>
        <div class="stat">
          <p>Мутаций:</p>
          <span id="numberOfGenerations" style="color: #ff3c00">${this.props.info.numberOfMutations}</span>
        </div>
        <div id="cell-info"></div>
      </div>
    `;
  }
  
  render() {
    const div = document.createElement('div');
    div.id = this._id;
  
    div.innerHTML = this.template();
  
    return div;
  }

  _getPropsWithDefaults(props) {
    return {
      info: props.info || {
        generation: 0,
        cellsAlive: 0,
        numberOfMutations: 0,
      },
    }
  }
}