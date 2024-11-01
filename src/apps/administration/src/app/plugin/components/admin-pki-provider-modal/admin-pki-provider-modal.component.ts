import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PKIProvider } from '~models/pki-provider.model';
import { KeynoaService } from '~services/keynoa.service';

@Component({
  selector: 'devity-admin-pki-providermodal',
  templateUrl: './admin-pki-provider-modal.component.html',
})
export class DevityAdminPKIProviderModalComponent {
  @Input() pkiProvider: PKIProvider;

  isProcessing = false;

  form = new FormGroup({
    url: new FormControl('', [Validators.required]),
    clientID: new FormControl('', [Validators.required]),
    clientSecret: new FormControl('', [Validators.required]),
  });

  constructor(
    private bsModalRef: BsModalRef,
    private keynoaService: KeynoaService
  ) {}

  close() {
    this.bsModalRef.hide();
  }

  async submit(): Promise<void> {
    this.isProcessing = true;

    console.log('submit', this.form.value);

    try {
      const auth = await this.keynoaService.auth(
        this.form.value['url'],
        this.form.value['clientID'],
        this.form.value['clientSecret']
      );
      console.log('submit', auth);
    } catch (error) {
      console.error(error);
    }

    this.isProcessing = false;
    this.close();
  }
}
