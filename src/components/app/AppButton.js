import { AbstractComponent } from '../core/AbstractComponent.js';

const BUTTON_TYPES = {
  primary: 'primary',
  secondary: 'secondary',
};

const BUTTON_COLORS = {
  default: 'default',
  success: 'success',
  danger: 'danger',
  accent: 'accent',
};

const BUTTON_ICONS = {
  pause: `
    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="4" height="22" rx="1" stroke-width="2"/>
      <rect x="11" y="1" width="4" height="22" rx="1" stroke-width="2"/>
    </svg>
  `,
}

export class AppButton extends AbstractComponent {

  constructor(props = { id: null, label: '', type: BUTTON_TYPES.primary, color: BUTTON_COLORS.default }, listeners = {}) {
    super(props, listeners);
    this._id = props.id || `app-button-${this._uid}`;
  }

  render() {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => {
      if (this.listeners.click) {
        this.listeners.click();
      }
    });
    btn.id = this._id;
    btn.classList = this.classes();
    
    if (BUTTON_ICONS[this._props.icon]) {
      btn.innerHTML = BUTTON_ICONS[this._props.icon];
    } else {
      btn.innerText = this._props.label;
    }

    this._el = btn;

    return btn;
  }

  update() {
    this._el.classList = this.classes();
    
    if (BUTTON_ICONS[this._props.icon]) {
      this._el.innerHTML = BUTTON_ICONS[this._props.icon];
    } else {
      this._el.innerText = this._props.label;
    }
  }

  classes() {
    const classes = ['app-button'];

    if (BUTTON_TYPES[this._props.type]) {
      classes.push(`app-button_${this._props.type}`);
    }

    if (BUTTON_COLORS[this._props.color]) {
      classes.push(`app-button_${this._props.color}`);
    }

    return classes.join(' ');
  }

  _getPropsWithDefaults(props) {
    return {
      label: props.label || '',
      type: props.type || BUTTON_TYPES.primary,
      color: props.color || BUTTON_COLORS.default,
      disabled: props.disabled || false,
    }
  }
}