import {LitElement, html} from '@polymer/lit-element';

class {{className}} extends LitElement {
  static get is() {
    return '{{fileName}}';
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
  }

  _render() {
    return html`
      <style>
      </style>
      <span>{{className}} works!</span>
    `;
  }
}

export default {{className}};

customElements.define({{className}}.is, {{className}});
