import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-ng-select',
  template: `
    <div class="form-group">
      <label [for]="id">{{ to.label }}</label>
      <select
        [id]="id"
        class="form-control"
        [formControl]="formControl"
        [formlyAttributes]="field"
        multiple
      >
        <option *ngFor="let option of to.options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  `,
})
export class FormlyFieldMultiSelect extends FieldType {}
