import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PKIProvider } from '~models/pki-provider.model';
import { KeynoaService } from '~services/keynoa.service';

@Component({
  selector: 'devity-certificate-authority-modal',
  templateUrl: './certificate-authority-modal.component.html',
})
export class DevityCertificateAuthorityModalComponent {
  @Input()
  get pkiProvider(): PKIProvider {
    return this._pkiProvider;
  }
  set pkiProvider(pkiProvider: PKIProvider) {
    console.log('set', pkiProvider, this.authorityTypes[0]);
    this._pkiProvider = pkiProvider;
    this.form.setValue({
      caType: pkiProvider.caType || this.authorityTypes[0].value,
      caName: pkiProvider.caName || '',
    });
  }

  form = new FormGroup({
    caType: new FormControl('keynoa', [Validators.required]),
    caName: new FormControl('', [Validators.required]),
  });

  authorityTypes = [
    { label: 'Keynoa CA', value: 'keynoa' },
    { label: 'Enterprise CA', value: 'enterprise' },
  ];

  isProcessing = false;

  private _pkiProvider?: PKIProvider;

  constructor(
    private bsModalRef: BsModalRef,
    private keynoaSerice: KeynoaService
  ) {}

  close() {
    this.bsModalRef.hide();
  }

  async submit(): Promise<void> {
    this.isProcessing = true;

    try {
      await this.keynoaSerice.set({ ...this.pkiProvider, ...this.form.value });
    } catch (error) {
      console.error(error);
    }

    this.isProcessing = false;
    this.close();
  }
}
