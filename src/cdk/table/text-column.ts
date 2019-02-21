/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Component,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import {CdkColumnDef} from './cell';
import {CdkTable} from './table';
import {getTableTextColumnMissingParentTableError} from './table-errors';

/** Configurable options for `CdkTextColumn`. */
export interface TextColumnOptions<T> {
  /**
   * Default function that provides the header text based on the column name if a header
   * text is not provided.
   */
  defaultHeaderTextTransform?: (name: string) => string;

  /** Default data accessor to use if one is not provided. */
  defaultDataAccessor?: (data: T, name: string) => string;
}

/** Injection token that can be used to specify the text column options. */
export const TEXT_COLUMN_OPTIONS =
  new InjectionToken<TextColumnOptions<any>>('text-column-options');

/**
 * Column that simply shows text content for the header and row cells. Assumes that the table
 * is using the native table implementation (`<table>`).
 *
 * By default, the name of this column will be the header text and data property accessor.
 * The header text can be overridden with the `headerText` input. Cell values can be overridden with
 * the `dataAccessor` input. Change the text justification to the start or end using the `justify`
 * input.
 */
@Component({
  moduleId: module.id,
  selector: 'cdk-text-column',
  template: `
    <ng-container cdkColumnDef>
      <th cdk-header-cell *cdkHeaderCellDef [style.text-align]="justify">
        {{headerText}}
      </th>
      <td cdk-cell *cdkCellDef="let data" [style.text-align]="justify">
        {{dataAccessor(data, name)}}
      </td>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  // Change detection is intentionally not set to OnPush. This component's template will be provided
  // to the table to be inserted into its view. This is problematic when change detection runs since
  // the bindings in this template will be evaluated _after_ the table's view is evaluated, which
  // mean's the template in the table's view will not have the updated value (and in fact will cause
  // an ExpressionChangedAfterItHasBeenCheckedError).
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CdkTextColumn<T> implements OnDestroy, OnInit {
  /** Column name that should be used to reference this column. */
  @Input()
  get name(): string {return this._name;}
  set name(name: string) {
    this._name = name;
    this.columnDef.name = name;
  }
  _name: string;

  /**
   * Text label that should be used for the column header. If this property is not
   * set, the header text will default to the column name with its first letter capitalized.
   */
  @Input() headerText: string;

  /**
   * Accessor function to retrieve the data rendered for each cell. If this
   * property is not set, the data cells will render the value found in the data's property matching
   * the column's name. For example, if the column is named `id`, then the rendered value will be
   * value defined by the data's `id` property.
   */
  @Input() dataAccessor: (data: T, name: string) => string;

  /** Alignment of the cell values. */
  @Input() justify: 'start' | 'end' = 'start';

  @ViewChild(CdkColumnDef) columnDef: CdkColumnDef;

  constructor(@Optional() private table: CdkTable<T>,
    @Optional() @Inject(TEXT_COLUMN_OPTIONS) private options: TextColumnOptions<T>) {
    this.options = options || {};
  }

  ngOnInit() {
    if (this.headerText === undefined) {
      this.headerText = this._createDefaultHeaderText();
    }

    if (!this.dataAccessor) {
      this.dataAccessor = this.options.defaultDataAccessor ||
        ((data: T, name: string) => (data as any)[name]);
    }

    if (this.table) {
      this.table.addColumnDef(this.columnDef);
    } else {
      throw getTableTextColumnMissingParentTableError();
    }
  }

  ngOnDestroy() {
    if (this.table) {
      this.table.removeColumnDef(this.columnDef);
    }
  }

  /**
   * Creates a default header text. Use the options' header text transformation function if one
   * has been provided. Otherwise simply capitalize the column name.
   */
  _createDefaultHeaderText() {
    if (this.options && this.options.defaultHeaderTextTransform) {
      return this.options.defaultHeaderTextTransform(this.name);
    }

    return this.name[0].toUpperCase() + this.name.slice(1);
  }
}
