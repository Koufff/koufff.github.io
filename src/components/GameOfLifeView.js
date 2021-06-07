import { AppButton } from './app/AppButton.js';
import { GameScreen } from './GameScreen.js';
import { CellInfoCard } from './CellInfoCard.js';
import { GameInfo } from './GameInfo.js';
import { AbstractComponent } from './core/AbstractComponent.js';

import { GameOfLifeApi } from '../api/GameOfLifeApi.js';

export class GameOfLifeView extends AbstractComponent {

  constructor(props = {}, listeners = {}) {
    super(props, listeners);
    
    this._id = props.id || `game-of-life-${this._uid}`;

    this._components = {
      AppButton,
      GameScreen,
      CellInfoCard,
      GameInfo,
    };

    this.game = null;

    this._state = {
      cells: [],
      selectedCell: null,
      isStarted: false,
      isPaused: false,
      error: '',
    };    
  }

  template() {
    return `
      <section class="wrapper" id="content">
        <aside class="wrapper__leftside">
          <div class="col-2fr">
            <div id="start-btn"></div>
            <div id="random-btn"></div>
          </div>
          <div id="game-info"></div>
        </aside>

        <div id="cell-info"></div>
        <div id="game-screen"></div>
      </section>
    `
  }
  
  render() {
    const div = document.createElement('div');
    div.innerHTML = this.template();
    div.id = this._id;
  
    return div;
  }

  _renderComponents() {
    this.startBtn = new this._components.AppButton(
      { label: 'Старт', type: 'primary', color: 'accent' },
      { click: () => this.onStartBtnClick() },
    ).mount('#start-btn');

    this.randomBtn = new this._components.AppButton(
      { label: 'Рандом', type: 'primary', color: 'default' },
      { click: () => this.random() },
    ).mount('#random-btn');
    
    this.gameInfo = new this._components.GameInfo().mount('#game-info');

    this.gameScreen = new this._components.GameScreen(
      { cells: this._state.cells },
      { cellClick: (cell) => this.setSelectedCell(cell) },
    ).mount('#game-screen');
    
    this.cellInfoCard = new this._components.CellInfoCard({ cell: this._state.selectedCell }).mount('#cell-info');
  }
  
  $_mounted() {
    this._renderComponents();
    this.init();
  }

  $_beforeUnmount() {
    this.stop();
  }

  // METHODS

  init() {
    this.createGameInstance();
    this.susbscribeToEvents();
  }

  createGameInstance() {
    this.game = new GameOfLifeApi();
    this.game.setup();
  }

  susbscribeToEvents() {
    this.game.on('start', () => this.onStart());
    this.game.on('pause', () => this.onPause());
    this.game.on('stop', () => this.onStop());
    this.game.on('error', () => this.onError());

    this.game.on('next_generation', (cells) => this.setCells(cells));
    this.game.on('update', (cells) => this.setCells(cells));
  }

  onStartBtnClick() {
    if (this._state.isStarted) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    this.game.start();
    this.startBtn.props.label = 'Пауза';
  }

  pause() {
    this.game.pause();
  }
  
  stop() {
    if (this.game) {
      this.game.stop();
    }
  }

  random() {
    this.game.random();
  }

  onStart() {
    this._state.isStarted = true;
  }
  
  onPause() {
    this._state.isStarted = false;
    this._state.isPaused = true;
    this.startBtn.props.label = 'Старт';
  }

  onStop() {
    this.reset();
  }
  
  onError(error) {
    this._state.error = error.message;
    console.error(error);
  }
  
  reset() {
    this._state.isStarted = false;
    this.setCells([]);
    this.setSelectedCell(null);
  }

  setCells(cells) {
    this.cells = cells;
    this.gameScreen.props.cells = this.cells;
  }

  setSelectedCell(cell) {
    this.selectedCell = cell;
    this.cellInfoCard.props.cell = this.selectedCell;
  }
}