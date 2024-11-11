import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PKIProvider } from '~models/pki-provider.model';
import { KeynoaService } from '~services/keynoa.service';

@Component({
  selector: 'devity-certificate-authority-modal',
  templateUrl: './certificate-authority-modal.component.html',
  styleUrl: './certificate-authority-modal.component.scss',
})
export class DevityCertificateAuthorityModalComponent {
  @Input()
  get pkiProvider(): PKIProvider {
    return this._pkiProvider;
  }
  set pkiProvider(pkiProvider: PKIProvider) {
    this._pkiProvider = pkiProvider;

    // step 1
    this.form[0].setValue({
      caType: pkiProvider.caType || this.authorityTypes[0].value,
      caName: pkiProvider.caName || '',
    });
  }

  form: FormGroup[] = [
    // step 1
    new FormGroup({
      caType: new FormControl('keynoa', [Validators.required]),
      caName: new FormControl('', [Validators.required]),
    }),
    // step 2
    new FormGroup({
      // TODO
    }),
    // step 3
    new FormGroup({
      // TODO
    }),
  ];
  stepTitles = ['First Step', 'Le Step 2', 'Step 3'];
  currentStep = 0;
  totalSteps = this.form.length;

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

  close(): void {
    this.bsModalRef.hide();
  }

  back(): void {
    if (this.currentStep > 0) this.currentStep--;
  }

  next(): void {
    if (this.currentStep < this.totalSteps - 1) this.currentStep++;
  }

  async submit(): Promise<void> {
    this.isProcessing = true;

    try {
      // join form values
      const formValues = {
        ...this.form[0].value,
        ...this.form[1].value,
        ...this.form[2].value,
      };
      await this.keynoaSerice.set({ ...this.pkiProvider, ...formValues });
    } catch (error) {
      console.error(error);
    }

    this.isProcessing = false;
    this.close();
  }
}
