/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, Input, SimpleChanges} from '@angular/core';
import {EXAMPLE_COMPONENTS} from '@angular/material-examples';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

/** Displays a set of material examples in a mat-accordion. */
@Component({
  selector: 'material-example-list',
  template: `
    <mat-accordion multi>
      <mat-expansion-panel *ngFor="let id of ids" [expanded]="expandAll">
        <mat-expansion-panel-header>
          <div class="header">
            <div class="title"> {{exampleComponents[id]?.title}} </div>
            <div class="id"> <{{id}}> </div>
          </div>
        </mat-expansion-panel-header>

        <ng-template matExpansionPanelContent>
          <material-example [id]="id"></material-example>
        </ng-template>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: [`
    mat-expansion-panel {
      box-shadow: none !important;
      background: transparent;
      border-top: 1px solid #CCC;
    }

    .header {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-right: 24px;
      align-items: center;
    }

    .id {
      font-family: monospace;
      color: #666;
      font-size: 12px;
    }
  `]
})
export class ExampleList {
  /** Type of examples being displayed. */
  @Input() type: string;

  /** IDs of the examples to display. */
  @Input() ids: string[] = [];

  @Input() category: string;

  @Input()
  set expandAll(v: boolean) { this._expandAll = coerceBooleanProperty(v); }
  get expandAll(): boolean { return this._expandAll; }
  _expandAll: boolean;

  ngOnChanges(changes: SimpleChanges) {
    // Append any matching category examples to the IDs.
    if (changes['category']) {
      this.ids = this.ids.concat(Object.keys(EXAMPLE_COMPONENTS)
          .filter(id => EXAMPLE_COMPONENTS[id].category === this.category));
    }
  }

  exampleComponents = EXAMPLE_COMPONENTS;
}
