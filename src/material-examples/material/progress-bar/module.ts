import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';
import {ProgressBarBufferExample} from './progress-bar-buffer/progress-bar-buffer-example';
import {
  ProgressBarConfigurableExample
} from './progress-bar-configurable/progress-bar-configurable-example';
import {
  ProgressBarDeterminateExample
} from './progress-bar-determinate/progress-bar-determinate-example';
import {
  ProgressBarIndeterminateExample
} from './progress-bar-indeterminate/progress-bar-indeterminate-example';
import {ProgressBarQueryExample} from './progress-bar-query/progress-bar-query-example';

const EXAMPLES = [
  ProgressBarBufferExample,
  ProgressBarConfigurableExample,
  ProgressBarDeterminateExample,
  ProgressBarIndeterminateExample,
  ProgressBarQueryExample,
];

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSliderModule,
    FormsModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class ProgressBarExamplesModule {
}
