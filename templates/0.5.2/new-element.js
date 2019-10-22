import {LitElement, html} from '@polymer/lit-element';

class NewElement extends ReduxMixin(LitElement) {
  static get is() {
    return 'new-element';
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
  }

  _render({}) {
    return html`
      <style>
      </style>
      <span>new element works</span>
    `;
  }
}

export default NewElement;

customElements.define(NewElement.is, NewElement);
