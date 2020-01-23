/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  OnDestroy,
  Optional,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import {BooleanInput} from '@angular/cdk/coercion';
import {MDCRadioAdapter, MDCRadioFoundation} from '@material/radio';
import {
  MAT_RADIO_DEFAULT_OPTIONS,
  MatRadioButton as BaseMatRadioButton,
  MatRadioDefaultOptions,
  MatRadioGroup as BaseMatRadioGroup,
} from '@angular/material/radio';
import {FocusMonitor} from '@angular/cdk/a11y';
import {UniqueSelectionDispatcher} from '@angular/cdk/collections';
import {ANIMATION_MODULE_TYPE} from '@angular/platform-browser/animations';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

// Re-export symbols used by the base Material radio component so that users do not need to depend
// on both packages.
export {MatRadioChange, MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';

/**
 * Provider Expression that allows mat-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * @docs-private
 */
export const MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatRadioGroup),
  multi: true
};


/**
 * A group of radio buttons. May contain one or more `<mat-radio-button>` elements.
 */
@Directive({
  selector: 'mat-radio-group',
  exportAs: 'matRadioGroup',
  providers: [MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
  host: {
    'role': 'radiogroup',
    'class': 'mat-mdc-radio-group',
    '[class.mat-radio-group]': 'false',
  },
})
export class MatRadioGroup extends BaseMatRadioGroup {
  /** Child radio buttons. */
  @ContentChildren(forwardRef(() => MatRadioButton), { descendants: true })
      _radios: QueryList<BaseMatRadioButton>;

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
}

@Component({
  selector: 'mat-radio-button',
  templateUrl: 'radio.html',
  styleUrls: ['radio.css'],
  host: {
    'class': 'mat-mdc-radio-button',
    '[class.mat-radio-button]': 'false',
    '[attr.id]': 'id',
  },
  exportAs: 'matRadioButton',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatRadioButton extends BaseMatRadioButton implements AfterViewInit, OnDestroy {

  private _radioAdapter: MDCRadioAdapter = {
    addClass: (className: string) => this._setClass(className, true),
    removeClass: (className: string) => this._setClass(className, false),
    setNativeControlDisabled: (disabled: boolean) => {
      if (this.disabled !== disabled) {
        this.disabled = disabled;
        this._changeDetector.markForCheck();
      }
    },
  };

  _radioFoundation = new MDCRadioFoundation(this._radioAdapter);
  _classes: {[key: string]: boolean} = {};

  constructor(@Optional() radioGroup: MatRadioGroup,
              elementRef: ElementRef,
              _changeDetector: ChangeDetectorRef,
              _focusMonitor: FocusMonitor,
              _radioDispatcher: UniqueSelectionDispatcher,
              @Optional() @Inject(ANIMATION_MODULE_TYPE) _animationMode?: string,
              @Optional() @Inject(MAT_RADIO_DEFAULT_OPTIONS)
              _providerOverride?: MatRadioDefaultOptions) {
    super(radioGroup, elementRef, _changeDetector, _focusMonitor,
        _radioDispatcher, _animationMode, _providerOverride);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this._radioFoundation.init();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._radioFoundation.destroy();
  }

  private _setClass(cssClass: string, active: boolean) {
    this._classes = {...this._classes, [cssClass]: active};
    this._changeDetector.markForCheck();
  }

  /**
   * Overrides the parent function so that the foundation can be set with the current disabled
   * state.
   */
  protected _setDisabled(value: boolean) {
    super._setDisabled(value);
    this._radioFoundation.setDisabled(this.disabled);
  }

  static ngAcceptInputType_checked: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
  static ngAcceptInputType_disableRipple: BooleanInput;
}
