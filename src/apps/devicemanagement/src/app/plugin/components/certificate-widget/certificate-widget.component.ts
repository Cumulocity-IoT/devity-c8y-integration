import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IManagedObject } from "@c8y/client";
import { BehaviorSubject } from "rxjs";
import { DevityProxyService } from "~services/devity-proxy.service";
import { isNil, maxBy } from "lodash";
import { CumulocityConfiguration, DevityDevice, DevityDeviceApp, DevityDeviceCertificate, ThinEdgeConfiguration } from "~models/rest-reponse.model";
import { CertificateActionService } from "~services/certificate-action.service";

@Component({
    templateUrl: './certificate-widget.component.html',
    styleUrl: './certificate-widget.component.less'
})
export class CertificateWidgetComponent {
  // TODO: add polling as needed for revoke
    device: IManagedObject;
    cert?: { 
      application: string,
      serialNumber: string,
      authority: string,
      issueDate: string,
      expirationDate: string,
      isActive: boolean 
    };

    issuingCA?: {
      caCertificateId: number;
      subjectCN: string;
      expirationDate: string;
    }

    trustAnchor?: {
      subjectCN: string;
      expirationDate: string;
    }

    keynoaRawData: {
      device?: DevityDevice,
      certificate?: DevityDeviceCertificate,
      app?: DevityDeviceApp,
      config?: ThinEdgeConfiguration
    } = {
      device: undefined,
      certificate: undefined,
      app: undefined,
      config: undefined
    };
      
      isLoading$ = new BehaviorSubject<boolean>(false);
      didFinishLoading = false;

    constructor(
        route: ActivatedRoute, 
        private devityProxy: DevityProxyService,
        private certActionService: CertificateActionService
      ) {
        this.device = route.snapshot.parent?.data["contextData"];

        this.refresh();
    }

    refresh(onlyDisplayCert = false) {
      this.didFinishLoading = false;
      this.isLoading$.next(true);
        this.loadKeynoaData(onlyDisplayCert).finally(() => {
          this.isLoading$.next(false);
          this.didFinishLoading = true;
        });
    }

    private isActive(cert: DevityDeviceCertificate) {
        const now = new Date();
        const expirationDate = new Date(cert.expiredAt);
        const isActive = now < expirationDate && (isNil(cert.revokedAt) || now < new Date(cert.revokedAt));
        return isActive;
    }

    private async loadKeynoaData(onlyDisplayCert = false) {
      const devices = await this.devityProxy.getDevices();
      const keynoaDevice = devices.find(d => d.serialNumber === this.device.name);
      const guid = keynoaDevice?.guid;
      if (!guid) { return; }
      this.keynoaRawData.device = keynoaDevice;
      this.loadAndDisplayCert(guid);
      if (!onlyDisplayCert) {
        const thinEdgeConfig = await this.loadThinEdgeConfig(guid);
        if (thinEdgeConfig) {
          this.keynoaRawData.config = thinEdgeConfig;
          const c8yConfig = await this.loadCumulocityConfig(thinEdgeConfig);
          if (c8yConfig) {
            this.loadAndDisplayTrustAnchor(c8yConfig);
            this.loadAndDisplayCertificateAuth(c8yConfig);
          }
        }
      }
    }

    private async loadAndDisplayCert(guid: DevityDevice['guid']) {
      try {
        const certs = await this.devityProxy.getCertificates(guid);
        const activeCerts = certs.filter(cert => this.isActive(cert));
        let certToShow: DevityDeviceCertificate;
        if (activeCerts.length) {
          certToShow = maxBy(activeCerts, (cert) => cert.issuedAt);
        } else if(certs.length) {
          certToShow = maxBy(certs, (cert) => cert.issuedAt);
        }

      if (certToShow) {
        const expirationDate = new Date(certToShow.expiredAt);
        this.cert = {
          application: certToShow.appInstanceId,
          serialNumber: certToShow.certificateSerialNumber,
          authority: certToShow.caFingerprint,
          issueDate: new Date(certToShow.issuedAt).toISOString(),
          expirationDate: expirationDate.toISOString(),
          isActive: this.isActive(certToShow)
        };
        this.keynoaRawData.certificate = certToShow;
      } else {
        throw new Error('No certificates available.')
      }
      } catch(e) {
        console.error('Could not load device certificate.', e);
      }
    }

    private async loadCumulocityConfig(thinEdgeConfig: ThinEdgeConfiguration): Promise<CumulocityConfiguration | undefined> {
      try {
        const c8yConfig = await this.devityProxy.getCumulocityConfig(thinEdgeConfig.cumulocityConfigurationId);
        return c8yConfig;
      } catch (e) {
        console.error('Could not load Cumulocity Config.', e);
        return undefined;
      }
    }

    private async loadAndDisplayTrustAnchor(c8yConfig: CumulocityConfiguration) {
      try {
        const trustAnchor = await this.devityProxy.getTrustAnchor(c8yConfig.cloudCaFingerprintPrimary);
        this.trustAnchor = {
          subjectCN: trustAnchor.subjectCn,
          expirationDate: trustAnchor.expirationTime
        };
      } catch(e) {
        console.error('Could not load Trust Anchor.', e);
      }
    }

    private async loadAndDisplayCertificateAuth(c8yConfig: CumulocityConfiguration) {
      try {
        const certificateAuthority = await this.devityProxy.getCertificateAuthority(c8yConfig.caId);
        this.issuingCA = {
          caCertificateId: certificateAuthority.caCertificateId,
          subjectCN: certificateAuthority.subjectCn,
          expirationDate: certificateAuthority.expirationTime,
        };
      } catch(e) {
        console.error('Could not load Certificate Authority.', e);
      }
    }

    private async loadThinEdgeConfig(guid: DevityDevice['guid']) {
      try {
        const apps = await this.devityProxy.getAppInstances(guid);
        const thinEdgeApp = apps.find(app => app.configType === 'thin-edge');
        if (thinEdgeApp) {
          this.keynoaRawData.app = thinEdgeApp;
          const thinEdgeConfig = await this.devityProxy.getThinEdgeConfig(thinEdgeApp.localConfigId);
          return thinEdgeConfig;
        } else {
          throw new Error('Could not find thin-edge app in /appInstances');
        }
      } catch(e) {
        console.error('Could not load thin-edge config.', e);
        return undefined;
      }
    }

    revoke() {
       this.certActionService.revoke(
        this.issuingCA.caCertificateId, 
        this.keynoaRawData.certificate.certificateSerialNumber
      ).then((res) => {
        if (res.status === 'success') {
          this.refresh();
        } else if (res.status === 'error') {
          console.error(res.error);
        }
      });
    }

    move() {
      this.certActionService.move(
        this.keynoaRawData.app,
        this.keynoaRawData.device
      ).then((res) => {
        if (res.status === 'success') {
          this.refresh();
        } else if (res.status === 'error') {
          console.error(res.error);
        }
      });
    }

    renew() {

    }
}