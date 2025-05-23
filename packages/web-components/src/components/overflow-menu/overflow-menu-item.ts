/**
 * Copyright IBM Corp. 2019, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { prefix } from '../../globals/settings';
import { carbonElement as customElement } from '../../globals/decorators/carbon-element';
import FocusMixin from '../../globals/mixins/focus';
import { OVERFLOW_MENU_SIZE } from './defs';
import styles from './overflow-menu.scss?lit';

/**
 * Overflow menu item.
 *
 * @element cds-overflow-menu-item
 * @fires cds-overflow-menu-item-clicked - The custom event fired when an overflow menu item is clicked.
 */
@customElement(`${prefix}-overflow-menu-item`)
class CDSOverflowMenuItem extends FocusMixin(LitElement) {
  /**
   * Handles `click` event on this element.
   */
  private _handleClick(event: Event) {
    this.dispatchEvent(
      new CustomEvent(
        (this.constructor as typeof CDSOverflowMenuItem).itemClicked,
        {
          bubbles: true,
          composed: true,
          detail: {
            evt: event,
          },
        }
      )
    );
  }

  /**
   * `true` if the action is danger.
   */
  @property({ type: Boolean, reflect: true })
  danger = false;

  /**
   * `true` if the overflow menu item should be disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * `true` if the item has a divider
   */
  @property({ type: Boolean, reflect: true })
  divider = false;

  /**
   * The link href of the overflow menu item.
   */
  @property()
  href = '';

  /**
   * The size of the overflow menu item.
   */
  @property({ reflect: true })
  size = OVERFLOW_MENU_SIZE.MEDIUM;

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'menuitem');
    }
    super.connectedCallback();
  }

  render() {
    const { _handleClick: handleClick } = this;
    return this.href
      ? html`
          <a
            class="${prefix}--overflow-menu-options__btn"
            ?disabled=${this.disabled}
            href="${this.href}"
            tabindex="-1"
            @click="${handleClick}">
            <div class="${prefix}--overflow-menu-options__option-content">
              <slot></slot>
            </div>
          </a>
        `
      : html`
          <button
            class="${prefix}--overflow-menu-options__btn"
            ?disabled=${this.disabled}
            tabindex="-1"
            @click="${handleClick}">
            <div class="${prefix}--overflow-menu-options__option-content">
              <slot></slot>
            </div>
          </button>
        `;
  }

  /**
   * The name of the custom event fired when the item is clicked.
   */
  static get itemClicked() {
    return `${prefix}-overflow-menu-item-clicked`;
  }

  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  static styles = styles;
}

export default CDSOverflowMenuItem;
