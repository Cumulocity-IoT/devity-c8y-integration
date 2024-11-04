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
  @Input()
  get pkiProvider(): PKIProvider {
    return this._pkiProvider;
  }
  set pkiProvider(provider: PKIProvider) {
    if (!!provider) {
      this._pkiProvider = provider;
      this.form.setValue({
        // need to "sanitize" as overlapping managed object fragments would kill the form
        id: provider.id || '',
        url: provider.url || '',
        clientID: provider.clientID || '',
        clientSecret: provider.clientSecret || '',
      });
    }
  }

  isProcessing = false;

  form = new FormGroup({
    url: new FormControl('', [Validators.required]),
    clientID: new FormControl('', [Validators.required]),
    clientSecret: new FormControl('', [Validators.required]),
    id: new FormControl(''),
  });

  private _pkiProvider?: PKIProvider;

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
      await this.keynoaService.set(this.form.value);
    } catch (error) {
      console.error(error);
    }

    this.isProcessing = false;
    this.close();
  }
}
