import {LitElement, html} from '@polymer/lit-element';

class ExampleFolder extends ReduxMixin(LitElement) {
  static get is() {
    return 'example-folder';
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
      <span>ExampleFolder works!</span>
    `;
  }
}

export default ExampleFolder;

customElements.define(ExampleFolder.is, ExampleFolder);
