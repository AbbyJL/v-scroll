import css from './v-scroll-css.js';

const BAR_MIN_HEIGHT = 16;
const TRACK_PADDING = 3;

const SHADOW_STYLE = `
  :host {
    display: block;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  ::slotted(*) {
    display: block;
  }
`;

const TEMPLATE = `
  <div part="container">
    <slot></slot>
  </div>
  <div part="track">
    <div part="bar"></div>
  </div>
`;

const injectGlobalStyle = () => {
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
};

const createShadow = el => {
  const shadow = el.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = SHADOW_STYLE;
  shadow.appendChild(style);
  const tmpl = document.createElement('template');
  tmpl.innerHTML = TEMPLATE;
  shadow.appendChild(tmpl.content.cloneNode(true));
  return shadow;
};

const getElements = shadow => ({
  container: shadow.querySelector('[part="container"]'),
  track: shadow.querySelector('[part="track"]'),
  bar: shadow.querySelector('[part="bar"]')
});

const calcBarHeight = (scroll_h, client_h) => 
  Math.max(BAR_MIN_HEIGHT, client_h * (client_h / scroll_h));

const calcBarPosition = (scroll_top, scroll_h, client_h) => {
  const max_scroll = scroll_h - client_h;
  const track_h = client_h - TRACK_PADDING * 2;
  const bar_h = calcBarHeight(scroll_h, client_h);
  const max_bar_pos = track_h - bar_h;
  return max_scroll > 0 ? (scroll_top / max_scroll) * max_bar_pos : 0;
};

const updateBar = (state) => {
  const { container, track, bar } = state;
  const { scrollHeight, clientHeight } = container;
  const has_scroll = scrollHeight > clientHeight;

  if (!has_scroll) {
    track.style.display = 'none';
    return;
  }

  track.style.display = 'block';
  bar.style.height = `${calcBarHeight(scrollHeight, clientHeight)}px`;
  bar.style.top = `${TRACK_PADDING + calcBarPosition(container.scrollTop, scrollHeight, clientHeight)}px`;
};

const onScroll = state => {
  if (state.is_dragging) return;
  const { container, bar } = state;
  const { scrollTop, scrollHeight, clientHeight } = container;
  bar.style.top = `${TRACK_PADDING + calcBarPosition(scrollTop, scrollHeight, clientHeight)}px`;
};

const onDragStart = (e, state) => {
  e.preventDefault();
  const { bar, container } = state;
  state.is_dragging = true;
  state.start_y = e.clientY;
  state.start_scroll_top = container.scrollTop;
  bar.setPointerCapture(e.pointerId);
};

const onDragMove = (e, state) => {
  if (!state.is_dragging) return;
  const { container } = state;
  const { scrollHeight, clientHeight } = container;
  const delta_y = e.clientY - state.start_y;
  const max_scroll = scrollHeight - clientHeight;
  const track_h = clientHeight - TRACK_PADDING * 2;
  const bar_h = calcBarHeight(scrollHeight, clientHeight);
  const max_bar_pos = track_h - bar_h;
  const bar_delta = (delta_y / max_bar_pos) * max_scroll;
  const new_scroll_top = Math.max(0, Math.min(max_scroll, state.start_scroll_top + bar_delta));
  container.scrollTop = new_scroll_top;
};

const onDragEnd = (e, state) => {
  state.is_dragging = false;
  state.bar.releasePointerCapture(e.pointerId);
};

const setupListeners = state => {
  state.scroll_handler = () => onScroll(state);
  state.container.addEventListener('scroll', state.scroll_handler);

  state.resize_observer = new ResizeObserver(() => updateBar(state));
  state.resize_observer.observe(state.container);
  state.resize_observer.observe(state.el);

  state.drag_start_handler = e => onDragStart(e, state);
  state.bar.addEventListener('pointerdown', state.drag_start_handler);

  state.drag_move_handler = e => onDragMove(e, state);
  state.drag_end_handler = e => onDragEnd(e, state);
  document.addEventListener('pointermove', state.drag_move_handler);
  document.addEventListener('pointerup', state.drag_end_handler);
  document.addEventListener('pointercancel', state.drag_end_handler);

  state.visibility_handler = () => {
    if (!document.body.contains(state.el)) {
      cleanup(state);
    }
  };
  document.addEventListener('DOMNodeRemoved', state.visibility_handler);
};

const cleanup = state => {
  if (state.resize_observer) {
    state.resize_observer.disconnect();
    state.resize_observer = null;
  }

  if (state.scroll_handler) {
    state.container.removeEventListener('scroll', state.scroll_handler);
    state.scroll_handler = null;
  }

  if (state.drag_start_handler) {
    state.bar.removeEventListener('pointerdown', state.drag_start_handler);
    state.drag_start_handler = null;
  }

  if (state.drag_move_handler) {
    document.removeEventListener('pointermove', state.drag_move_handler);
    state.drag_move_handler = null;
  }

  if (state.drag_end_handler) {
    document.removeEventListener('pointerup', state.drag_end_handler);
    document.removeEventListener('pointercancel', state.drag_end_handler);
    state.drag_end_handler = null;
  }

  if (state.visibility_handler) {
    document.removeEventListener('DOMNodeRemoved', state.visibility_handler);
    state.visibility_handler = null;
  }
};

const defineVScroll = () => {
  injectGlobalStyle();

  class VScroll extends HTMLElement {
    constructor() {
      super();
      const shadow = createShadow(this);
      const { container, track, bar } = getElements(shadow);

      this._state = {
        el: this,
        container,
        track,
        bar,
        is_dragging: false,
        start_y: 0,
        start_scroll_top: 0,
        resize_observer: null,
        scroll_handler: null,
        drag_start_handler: null,
        drag_move_handler: null,
        drag_end_handler: null,
        visibility_handler: null
      };
    }

    connectedCallback() {
      setupListeners(this._state);
      updateBar(this._state);
    }

    disconnectedCallback() {
      cleanup(this._state);
    }
  }

  customElements.define('v-scroll', VScroll);
};

defineVScroll();