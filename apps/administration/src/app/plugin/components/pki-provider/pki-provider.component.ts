import { Component } from '@angular/core';
import { PKIProvider } from '@models/pki-provider.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DevityAdminPKIProviderModalComponent } from '../admin-pki-provider-modal/admin-pki-provider-modal.component';

@Component({
  selector: 'devity-pki-provider',
  templateUrl: './pki-provider.component.html',
})
export class DevityPKIProviderComponent {
  constructor(private bdModalService: BsModalService) {}

  openModal(pkiProvider?: PKIProvider): void {
    this.bdModalService.show(DevityAdminPKIProviderModalComponent, {
      initialState: {
        pkiProvider,
      },
    });
  }
}
