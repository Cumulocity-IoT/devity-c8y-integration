import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IManagedObject } from "@c8y/client";
import { BsModalService } from "ngx-bootstrap/modal";
import { CertificateMoveModalComponent } from "../certificate-move-modal/certificate-move-modal.component";
import { firstValueFrom } from "rxjs";
import { gettext, ModalService, Status } from "@c8y/ngx-components";
import { DevityProxyService } from "~services/devity-proxy.service";
import { maxBy } from "lodash";

@Component({
    templateUrl: './certificate-widget.component.html',
    styleUrl: './certificate-widget.component.less'
})
export class CertificateWidgetComponent {
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
      
      isLoading = false;
      didFinishLoading = false;

    constructor(
        route: ActivatedRoute, 
        private bsModalService: BsModalService, 
        private modal: ModalService,
        private devityProxy: DevityProxyService) {
        this.device = route.snapshot.parent?.data["contextData"];

        this.isLoading = true;
        this.loadKeynoaData().finally(() => {
          this.isLoading = false;
          this.didFinishLoading = true;
        });
    }

    private async loadKeynoaData() {
      const devices = await this.devityProxy.getDevices();
      const keynoaDevice = devices.find(d => d.serialNumber === this.device.name);
      const guid = keynoaDevice?.guid;
      if (!guid) { return; }
      const certs = await this.devityProxy.getCertificates(guid);
      // find the most recent cert
      const newestCert = maxBy(certs, (cert) => cert.issuedAt);

      const expirationDate = new Date(newestCert.expiredAt);
      const now = new Date();
      // TODO: find out how to determine whether its active or not
      const isActive = expirationDate > now;
      this.cert = {
        application: newestCert.appInstanceId,
        serialNumber: newestCert.certificateSerialNumber,
        authority: newestCert.caFingerprint,
        issueDate: new Date(newestCert.issuedAt).toISOString(),
        expirationDate: expirationDate.toISOString(),
        isActive
      };

      const apps = await this.devityProxy.getAppInstances(guid);
      const thinEdgeApp = apps.find(app => app.configType === 'thin-edge');
      if (thinEdgeApp) {
        const thinEdgeConfig = await this.devityProxy.getThinEdgeConfig(thinEdgeApp.localConfigId);
        const c8yConfig = await this.devityProxy.getCumulocityConfig(thinEdgeConfig.cumulocityConfigurationId);
        
        const trustAnchor = await this.devityProxy.getTrustAnchor(c8yConfig.cloudCaFingerprintPrimary);
        this.trustAnchor = {
          subjectCN: trustAnchor.subjectCn,
          expirationDate: trustAnchor.expirationTime
        };

        const certificateAuthority = await this.devityProxy.getCertificateAuthority(c8yConfig.caId);
        this.issuingCA = {
          subjectCN: certificateAuthority.subjectCn,
          expirationDate: certificateAuthority.expirationTime,
        };
      }

      // this.devityProxy.getCertificateAuthorities().then(cas => {
      //   console.log(cas);
      // });
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