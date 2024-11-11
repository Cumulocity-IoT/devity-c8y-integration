import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PKIProvider } from '~models/pki-provider.model';
import { KeynoaService } from '~services/keynoa.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  CertificateAuthorityFormlyResult,
  CertificatePolicyFormlyResult,
  Step2FormlyFieldConfig,
  Step3FormlyFieldConfig,
} from './formly-templates.model';
import { FormlyHelperService } from './formly-helper.service';
import { DevityProxyService } from '~services/devity-proxy.service';
import { AlertService } from '@c8y/ngx-components';
import { isNil } from 'lodash';
// import moment from 'moment';

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
  readonly BASIC_DETAILS_STEP = 0;

  readonly CA_PROPERTIES_STEP = 1;
  formlyStep2 = new FormGroup({});
  step2Fields: FormlyFieldConfig[] = [];
  // @ts-ignore
  step2Model: CertificateAuthorityFormlyResult = {};

  readonly CERT_POLICY_STEP = 2;
  formlyStep3 = new FormGroup({});
  step3Fields: FormlyFieldConfig[] = [];
  // @ts-ignore
  step3Model: CertificatePolicyFormlyResult = {};

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
    // step4
    new FormGroup({
      pattern: new FormControl('', [Validators.required]),
    }),
  ];
  stepTitles = [
    'Basic Details',
    'CA Properties',
    'Certificate Policy',
    'Device Selectors',
  ];
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
    private proxy: DevityProxyService,
    private formlyHelper: FormlyHelperService,
    private alert: AlertService
  ) {}

  close(): void {
    this.bsModalRef.hide();
  }

  back(): void {
    if (this.currentStep > 0) this.currentStep--;
  }

  next(): void {
    if (this.currentStep < this.totalSteps - 1) this.currentStep++;
    if (
      this.currentStep === this.CA_PROPERTIES_STEP ||
      this.currentStep === this.CERT_POLICY_STEP
    ) {
      this.reloadFormlyStep(this.currentStep);
    }
  }

  private reloadFormlyStep(currentStep: 1 | 2) {
    if (currentStep === this.CA_PROPERTIES_STEP) {
      this.step2Fields = Step2FormlyFieldConfig;
    } else if (currentStep === this.CERT_POLICY_STEP) {
      this.step3Fields = Step3FormlyFieldConfig;
    }
  }

  async submit(): Promise<void> {
    this.isProcessing = true;

    try {
      const caName = this.form[0].get('caName').value;
      const config = this.formlyHelper.convertFormlyModelToPayload({
        ...this.step2Model,
        ...this.step3Model,
      });
      const pattern = this.form[3].get('pattern').value;
      if (isNil(caName) || isNil(pattern)) {
        this.alert.warning('Cancelled submit as form incomplete.');
        return;
      }

      console.log('Creating CA...');
      const createdCA = await this.proxy.createCertificateAuthority(
        caName,
        config
      );
      const cas = await this.proxy.getCertificateAuthorities();
      const caWithId = cas.find((ca) => ca.pkiPath === createdCA.pkiPath);

      const c8yConfig = {
        c8yUrl: 'thin-edge-io.eu-latest.cumulocity.com',
        caId: caWithId.caId,
        cloudCaFingerprintPrimary:
          '5622207e1ba285f172756f6019af92ac808ed63286e24dfecc1e79873fb5d140f1ceb7133f2476e89a5f75f711f9813a9fbb8fd5287f64adfdcc53b864f9bdc5',
        cloudCaFingerprintSecondary: null,
        useOsTrustAnchor: true,
      };
      console.log('Creating Cumulocity config...');
      const c8yConfigResponse = await this.proxy.createCumulocityConfig(
        c8yConfig
      );
      console.log('Creating Certificate template...');
      const certTemplateResponse = await this.proxy.createCertificateTemplate(
        config.defaultCertificateTemplate
      );
      console.log('Creating Thin Edge config...');
      const thinEdgeConfig = {
        cumulocityConfigurationId: c8yConfigResponse.id,
        certificateTemplateId: certTemplateResponse.id,
        templateName: 'my-thinEdge-configuration-' + caName,
      };
      const thinEdgeConfigResponse = await this.proxy.createThinEdgeConfig(
        thinEdgeConfig
      );
      console.log('Creating device selector...');

      const deviceSelector = {
        configId: thinEdgeConfigResponse.id,
        configType: 'THIN-EDGE',
        weight: 100,
        patterns: {
          MODEL: pattern,
        },
      };
      await this.proxy.createDeviceSelector(deviceSelector);

      console.log('Creating Keynoa MO representation...');
      await this.keynoaSerice.set({
        ...this.pkiProvider,
        caId: caWithId.caId,
        c8yConfigId: c8yConfigResponse.id,
        certTemplateId: certTemplateResponse.id,
        thinEdgeConfigId: thinEdgeConfigResponse.id,
      });

      this.alert.success('Creation of Certificate Authority successful.');
    } catch (error) {
      this.alert.danger(
        'Creation of Certificate Authority failed.',
        `${error}`
      );
      console.error(error);
    } finally {
      this.isProcessing = false;
      this.close();
    }
  }
}
