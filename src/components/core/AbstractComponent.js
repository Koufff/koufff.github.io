let numberOfComponents = 0;

const onNewComponent = () => numberOfComponents += 1;

export class AbstractComponent {

  constructor(props = {}, listeners = {}) {
    onNewComponent();

    this._el = null;
    this._container = null;
    
    this._uid = numberOfComponents;

    this._props = this._getPropsWithDefaults(props);
    this._defineReactiveProps();
    this.listeners = listeners;

    this._components = null;
  }

  render() {
    throw new TypeError('no render function');
  }
  
  mount(container) {
    const containerNode = document.querySelector(container);

    if (containerNode) {
      const parent = containerNode.parentNode;
      parent.removeChild(containerNode);

      parent.appendChild(this.render());
      this.$_mounted();
    }

    return this;
  }

  unmount() {
    this.$_beforeUnmount();
  }

  update() {
    if (!this._el) {
      this._el = document.querySelector(`#${this._id}`);
    }

    console.log(this._el)
    
    this.$_beforeUpdate();

    if (this._el) {
      this._el.innerHTML = this.template();
      this.$_updated();
    }
  }

  template() {
    throw new TypeError('no template')
  }
  
  _getPropsWithDefaults(props) {
    return props;
  }

  _defineReactiveProps() {
    const self = this;

    this.props = new Proxy(this._props, {
      set(target, prop, value) {
        target[prop] = value;
        self.update();

        return true; // falsish error prevention hack for non-primitive types
      }
    });
  }

  _renderComponents() {}
  
  // Hooks

  $_mounted() {}

  $_beforeUpdate() {}

  $_updated() {}

  $_beforeUnmount() {}
}