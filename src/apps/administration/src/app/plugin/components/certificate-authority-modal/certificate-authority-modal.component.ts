import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PKIProvider } from '~models/pki-provider.model';
import { KeynoaService } from '~services/keynoa.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Step2FormlyFieldConfig, Step3FormlyFieldConfig } from './formly-templates.model';



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

  formlyStep2 = new FormGroup({});
  step2Fields: FormlyFieldConfig[] = [];
  step2Model = {};

  formlyStep3 = new FormGroup({});
  step3Fields: FormlyFieldConfig[] = [];
  step3Model = {};

  form: FormGroup[] = [
    // step 1
    new FormGroup({
      caType: new FormControl('keynoa', [Validators.required]),
      caName: new FormControl('', [Validators.required]),
    }),
    // step 2
    this.formlyStep2,
    // step 3
    this.formlyStep3,
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
    private keynoaSerice: KeynoaService,
  ) {}

  close(): void {
    this.bsModalRef.hide();
  }

  back(): void {
    if (this.currentStep > 0) this.currentStep--;
  }

  next(): void {
    if (this.currentStep < this.totalSteps - 1) this.currentStep++;
    if (this.currentStep === 1 || this.currentStep === 2) {
      this.reloadFormlyStep(this.currentStep);
    }
  }

  private reloadFormlyStep(currentStep: 1 | 2) {
    if (currentStep === 1) {
      this.step2Fields = Step2FormlyFieldConfig;
    } else if (currentStep === 2) {
     this.step3Fields = Step3FormlyFieldConfig;
    }
    
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
