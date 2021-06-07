import { Observer } from '../utils/observer.js';
import { GameService } from '../game/game.service.js';

const LOOP_DELAY = 500;

const EVENTS = {
  start: 'start',
  pause: 'pause',
  stop: 'stop',
  error: 'error',
  nextGeneration: 'next_generation',
  update: 'update',
};

export class GameOfLifeApi extends Observer {
  constructor(gameService) {
    super();
    this._game = null;
    this._interval = null;
    this._gameService = gameService || new GameService();
  }

  setup(gameSettings) {
    this._setupGame(gameSettings);
  } 

  start() {
    this._startGameLoop();
    this._notify(EVENTS.start);
  }

  pause() {
    clearInterval(this._interval);
    this._notify(EVENTS.pause);
  }

  stop() {
    clearInterval(this.interval);
    this._game.reset();
    this._notify(EVENTS.stop);
  }

  random() {
    this._game.random();
    this._notify(EVENTS.update, this._game.cells);
  }

  _setupGame(settings = {
    size: {
      width: 30,
      height: 30,
    },
    borderless: false,
  }) {
    this._game = this._gameService.create(settings);
  }

  _startGameLoop() {
    this._interval = setInterval(() => this._nextGeneration(), LOOP_DELAY);
  }

  _nextGeneration() {
    this._game.next();
    this._notify(EVENTS.nextGeneration, this._game.cells);
  }
}
