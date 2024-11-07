import { Component } from '@angular/core';
import { CellRendererContext, CommonModule } from '@c8y/ngx-components';
import { DevityCertificateStatus } from '~models/rest-reponse.model';

@Component({
  standalone: true,
  template:
    '<span [attr.class]="class"><i [c8yIcon]="icon"></i> {{ context.item.status | translate }}</span>',
  imports: [CommonModule],
})
export class CertificateStatusCellRendererComponent {
  icon = 'help';
  class = '';

  constructor(public context: CellRendererContext) {
    switch (context.item.status) {
      case DevityCertificateStatus.VALID:
        this.icon = 'ok';
        this.class = 'text-success';
        break;
      case DevityCertificateStatus.REVOKED:
        this.icon = 'exclamation-circle';
        this.class = 'text-muted';
        break;
      case DevityCertificateStatus.EXPIRED:
        this.icon = 'cross-circle';
        this.class = 'text-danger';
        break;
      default:
    }
  }
}
