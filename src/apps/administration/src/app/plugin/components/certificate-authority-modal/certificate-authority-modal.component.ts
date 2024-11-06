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
  @Input() pkiProvider: PKIProvider;

  form = new FormGroup({
    type: new FormControl('keynoa', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

  authorityTypes = [
    { label: 'Keynoa CA', value: 'keynoa' },
    { label: 'Enterprise CA', value: 'enterprise' },
  ];

  isProcessing = false;

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
