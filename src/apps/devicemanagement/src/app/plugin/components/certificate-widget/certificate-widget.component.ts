import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IManagedObject } from "@c8y/client";
import { BsModalService } from "ngx-bootstrap/modal";
import { CertificateMoveModalComponent } from "../certificate-move-modal/certificate-move-modal.component";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { gettext, ModalService, Status } from "@c8y/ngx-components";
import { DevityProxyService } from "~services/devity-proxy.service";
import { isNil, maxBy } from "lodash";
import { CumulocityConfiguration, DevityDevice, DevityDeviceCertificate, ThinEdgeConfiguration } from "~models/rest-reponse.model";

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
      subjectCN: string;
      expirationDate: string;
    }

    trustAnchor?: {
      subjectCN: string;
      expirationDate: string;
    }
      
      isLoading$ = new BehaviorSubject<boolean>(false);
      didFinishLoading = false;

    constructor(
        route: ActivatedRoute, 
        private bsModalService: BsModalService, 
        private modal: ModalService,
        private devityProxy: DevityProxyService) {
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
      this.loadAndDisplayCert(guid);
      if (!onlyDisplayCert) {
        const thinEdgeConfig = await this.loadThinEdgeConfig(guid);
        if (thinEdgeConfig) {
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

    async revoke() {
        try {
            await this.modal.confirm(
              "Revoke certificate",
              "You are about to revoke the certificate. This will remove the device from the tenant.",
              Status.DANGER,
              {
                ok: gettext("Revoke"),
              },
            );
            // eslint-disable-next-line no-console
            console.log("Revoke clicked");
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log("Cancel clicked");
          }
    }

    async renew() {
        try {
            await this.modal.confirm(
              "Renew certificate",
              "You are about to renew the certificate. Are you sure you want to continue?",
              Status.WARNING,
              {
                ok: gettext("Renew"),
              },
            );
            // eslint-disable-next-line no-console
            console.log("Renew clicked");
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log("Cancel clicked");
          }
    }

    async move() {
        const ref = this.bsModalService.show(CertificateMoveModalComponent);
        const url = await firstValueFrom(ref.content.closeSubject);
        if (url) {

        }
    }

}