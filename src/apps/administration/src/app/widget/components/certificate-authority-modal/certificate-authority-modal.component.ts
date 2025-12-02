import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PKIProvider } from '~models/pki-provider.model';
// import { KeynoaService } from '~services/keynoa.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  CertificateAuthorityFormlyResult,
  CertificatePolicyFormlyResult,
  Step2FormlyFieldConfig,
  Step3FormlyFieldConfig,
} from './formly-templates.model';
import { FormlyHelperService } from './formly-helper.service';
import { AlertService } from '@c8y/ngx-components';
import { DevityProxyService } from '~services/devity-proxy.service';
import { CumulocityConfiguration } from '~models/rest-reponse.model';
import { TenantService, TrustedCertificateService } from '@c8y/client';
import { KeynoaService } from '~services/keynoa.service';
import { isNil } from 'lodash';

@Component({
  selector: 'devity-certificate-authority-modal',
  templateUrl: './certificate-authority-modal.component.html',
  styleUrl: './certificate-authority-modal.component.scss',
  standalone: false,
})
export class DevityCertificateAuthorityModalComponent {
  existingCANames: string[] = [];
  @Input()
  get pkiProvider(): PKIProvider {
    return this._pkiProvider;
  }
  set pkiProvider(pkiProvider: PKIProvider) {
    this._pkiProvider = pkiProvider;

    // step 1
    this.form[0].setValue({
      caType: pkiProvider.caType ?? this.authorityTypes[0].value,
      caName: pkiProvider.caName ?? '',
      thinEdgeName: pkiProvider.thinEdgeName ?? '',
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
      thinEdgeName: new FormControl('', [Validators.required]),
    }),
    // step 2
    this.formlyStep2,
    // step 3
    this.formlyStep3,
    // step4
    new FormGroup({
      pattern: new FormControl('', [Validators.required]),
      patternType: new FormControl('MODEL', [Validators.required]),
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

  readonly DEVICE_SELECTOR_PATTERN_OPTIONS: { label: string; value: string }[] = [
  { label: 'Manufacturer', value: 'MANUFACTURER' },
  { label: 'Model', value: 'MODEL' },
  { label: 'Firmware', value: 'FIRMWARE' },
  { label: 'Building', value: 'BUILDING' },
  { label: 'Plant', value: 'PLANT' },
  { label: 'Application', value: 'APPLICATION' },
  { label: 'Localization', value: 'LOCALIZATION' },
  { label: 'Serial No', value: 'SERIAL_NO' },
  { label: 'Guid', value: 'GUID' },
  { label: 'URN', value: 'URN' },
  { label: 'OS Name', value: 'OS_NAME' },
  { label: 'OS Arch', value: 'OS_ARCH' },
  { label: 'Device IP', value: 'DEVICE_IP' },
  { label: 'OPC UA Server Port', value: 'OPC_UA_SERVER_PORT' },
  { label: 'Product Uri', value: 'PRODUCT_URI' },
  { label: 'Device MAC', value: 'MAC' },
  { label: 'Hardware', value: 'HARDWARE' },
];


  isProcessing = false;

  private _pkiProvider?: PKIProvider;

  constructor(
    private bsModalRef: BsModalRef,
    private keynoaService: KeynoaService,
    private proxy: DevityProxyService,
    private formlyHelper: FormlyHelperService,
    private alert: AlertService,
    private trustedCertService: TrustedCertificateService,
    private tenantService: TenantService
  ) { }

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
      const patternType = this.form[3].get('patternType').value;
      if (isNil(caName) || isNil(pattern) || isNil(patternType)) {
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

      console.log('Assign permissions...');
      const resources = await this.proxy.getPermissions();
      const roleIds = resources.resourceRoles.map(resource => resource.roles.map((r) => r.roleId)).flat();
      const roles = await this.proxy.getRolesForCA(caWithId.id);
      const firstMatching = roles.find((r) => r.roleName === 'Head of CA Operations');
      if (firstMatching) {
        roleIds.push(firstMatching.roleId);
      }
      await this.proxy.setPermissions(Array.from(new Set(roleIds)));


      console.log('Creating Cumulocity Trusted Certificate...');
      await this.trustedCertService.create({
        name: caName,
        fingerprint: caWithId.caCertificate.fingerprint,
        certInPemFormat: caWithId.caCertificate.certificate,
        autoRegistrationEnabled: true,
        status: 'ENABLED',
      });

      const { data: tenant } = await this.tenantService.current();
      const domain = tenant.domainName;

      const c8yConfig: Omit<CumulocityConfiguration, 'id'> = {
        c8yUrl: domain,
        issuingCaId: caWithId.id,
        cloudCaFingerprintPrimary: caWithId.caCertificate.fingerprint,
        cloudCaFingerprintSecondary: null,
        useOsTrustAnchor: false,
        cloudWebUiLink: `https://${domain}/apps/devicemanagement`,
        connectorName: `${domain} - ${caName}`
      };
      console.log('Creating Cumulocity config...', c8yConfig);
      const c8yConfigResponse = await this.proxy.createCumulocityConfig(
        c8yConfig
      );
      console.log('Creating Thin Edge config...');
      const thinEdgeName = this.form[0].get('thinEdgeName').value;
      const thinEdgeConfig = {
        cumulocityConfigurationId: c8yConfigResponse.id,
        certificateTemplateId: 0,
        certificateTemplate: config.defaultCertificateTemplate,
        templateName: thinEdgeName,
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
          [`${patternType}`]: pattern,
        },
      };
      await this.proxy.createDeviceSelector(deviceSelector);

      console.log('Creating Keynoa MO representation...');
      await this.keynoaService.set({
        ...this.pkiProvider,
        caId: caWithId.id,
        c8yConfigId: c8yConfigResponse.id,
        certTemplateId: thinEdgeConfigResponse.certificateTemplateId,
        thinEdgeConfigId: thinEdgeConfigResponse.id,
        thinEdgeName
      });

      this.alert.success('Creation of Certificate Authority successful.');
    } catch (error) {
      this.alert.danger(
        'Creation of Certificate Authority failed.',
        `${JSON.stringify(error)}`
      );
      console.error(error);
    } finally {
      this.isProcessing = false;
      this.close();
    }
  }
}
