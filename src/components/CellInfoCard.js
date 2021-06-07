import { AbstractComponent } from './core/AbstractComponent.js';

export class CellInfoCard extends AbstractComponent {
  constructor(props = {}, listeners = {}) {
    super(props, listeners);

    this._id = props.id || `cell-info-card-${this._uid}`;
  }

  template() {
    let dna = '';

    if (this.props.cell) {
      try {
        dna = this.props.cell.dna.map((row) => `${row.isDominant ? 'д' : 'р'}(${row.pairs.map(p => p.join('-')).join(',')})`).join('; ');
      } catch (error) {
        console.log(error);
        console.log(this.props.cell);        
      }

      return `
      <h5>Клетка </h5>
        ДНК: ${dna}
        координаты: x: ${this.props.cell.location.x}, y: ${this.props.cell.location.y}.
        Родители: ${this.props.cell.parents ? 'есть' : 'нет'}
      `;
    }
    return '';
  }
  
  render() {
    const div = document.createElement('div');
    div.id = this._id;

    return div;
  }
}