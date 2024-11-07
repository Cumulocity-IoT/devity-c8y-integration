import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CellRendererContext, CommonModule } from '@c8y/ngx-components';

@Component({
  standalone: true,
  template: '<a [routerLink]="link">{{ context.value | translate }}</a>',
  imports: [CommonModule, RouterModule],
})
export class CertificateAssetCellRendererComponent {
  link: (string|number)[] = [];

  constructor(public context: CellRendererContext) {
    this.link = ['/device', this.context.item?.device?.id];
  }
}
