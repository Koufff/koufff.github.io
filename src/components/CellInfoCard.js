import { AbstractComponent } from './core/AbstractComponent.js';

export class CellInfoCard extends AbstractComponent {
  constructor(props = {}, listeners = {}) {
    super(props, listeners);

    this._id = props.id || `cell-info-card-${this._uid}`;
  }

  template() {
    let dna = '';
    if (this.props.cell) {
      dna = this._props.cell.dna.map((row) => `${row.isDominant ? 'д' : 'р'}(${row.pairs.map(p => p.join('-')).join(',')})`).join('; ');
      return `
        <h5>Клетка </h5>
        <br />
        ДНК: ${dna}
        <br /><br />
        Координаты: x: ${this.props.cell.location.x}, y: ${this.props.cell.location.y}.
        <br /><br />
        Родители: ${this.props.cell.parents ? 'есть' : 'нет'}
      `;
    }
    return '';
  }
  
  render() {
    const div = document.createElement('div');
    div.id = this._id;
    this._el = div;
    div.innerHTML = this.template();
    return div;
  }

  _getPropsWithDefaults(props) {
    return {
      cell: props.cell || null,
    }
  }
}