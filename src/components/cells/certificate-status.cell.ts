import { Component } from '@angular/core';
import { CellRendererContext, CommonModule } from '@c8y/ngx-components';
import {
  DevityCertificateStatus,
  DevityDeviceCertificate,
} from '~models/rest-reponse.model';

@Component({
  standalone: true,
  template: '<span [attr.class]="class"><i [c8yIcon]="icon"></i> {{ status | translate }}</span>',
  imports: [CommonModule],
})
export class CertificateStatusCellRendererComponent {
  status = DevityCertificateStatus.UNKNOWN;
  icon = 'help';
  class = '';

  constructor(public context: CellRendererContext) {
    const certificate: DevityDeviceCertificate = context.item;
    const now = new Date().getTime();

    if (!!certificate.revokedAt) {
      this.status = DevityCertificateStatus.REVOKED;
      this.icon = 'exclamation-circle';
      this.class = 'text-muted';
    } else if (certificate.expiredAt <= now) {
      this.status = DevityCertificateStatus.EXPIRED;
      this.icon = 'cross-circle';
      this.class = 'text-danger';
    } else {
      this.status = DevityCertificateStatus.VALID;
      this.icon = 'ok';
      this.class = 'text-success';
    }
  }
}
