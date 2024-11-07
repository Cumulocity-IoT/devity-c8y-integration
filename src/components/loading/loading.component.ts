import { Component } from '@angular/core';
import { CoreModule } from '@c8y/ngx-components';

@Component({
  selector: 'sps-loading',
  template: '<c8y-loading></c8y-loading>',
  styleUrl: './loading.component.less',
  standalone: true,
  imports: [CoreModule],
})
export class SPSLoadingComponent {}
