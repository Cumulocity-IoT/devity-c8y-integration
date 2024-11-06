import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PKIProvider } from '~models/pki-provider.model';
import { KeynoaService } from '~services/keynoa.service';
import { DevityAdminPKIProviderModalComponent } from '../admin-pki-provider-modal/admin-pki-provider-modal.component';
import { DevityCertificateAuthorityModalComponent } from '../certificate-authority-modal/certificate-authority-modal.component';

@Component({
  selector: 'devity-pki-provider',
  templateUrl: './pki-provider.component.html',
})
export class DevityPKIProviderComponent implements OnInit {
  providers?: PKIProvider[];
  isLoading = true;

  constructor(
    private bdModalService: BsModalService,
    private keynoaService: KeynoaService
  ) {}

  ngOnInit(): void {
    void this.reload();
  }

  certificateAuthorityModal(provider: PKIProvider): void {
    const modalRef = this.bdModalService.show(
      DevityCertificateAuthorityModalComponent,
      {
        initialState: {
          pkiProvider: provider,
        },
        class: 'modal-xs'
      }
    );

    modalRef.onHide.subscribe(() => this.reload());
  }

  async connect(provider: PKIProvider): Promise<void> {
    // TODO
    const auth = await this.keynoaService.connect(provider);

    console.log('auth', auth);
  }

  async delete(provider: PKIProvider): Promise<void> {
    this.isLoading = true;
    await this.keynoaService.delete(provider.id);
    this.isLoading = false;

    await this.reload;
  }

  openModal(provider?: PKIProvider): void {
    const modalRef = this.bdModalService.show(
      DevityAdminPKIProviderModalComponent,
      {
        initialState: {
          pkiProvider: provider,
        },
      }
    );

    modalRef.onHide.subscribe(() => this.reload());
  }

  async reload(): Promise<void> {
    this.isLoading = true;

    try {
      this.providers = await this.keynoaService.list();
    } catch (error) {
      console.error(error);
    }

    this.isLoading = false;
  }
}
