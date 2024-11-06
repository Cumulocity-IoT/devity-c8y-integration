import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IManagedObject } from "@c8y/client";
import { BsModalService } from "ngx-bootstrap/modal";
import { CertificateMoveModalComponent } from "../certificate-move-modal/certificate-move-modal.component";
import { firstValueFrom } from "rxjs";
import { gettext, ModalService, Status } from "@c8y/ngx-components";
import { DevityProxyService } from "~services/devity-proxy.service";

@Component({
    templateUrl: './certificate-widget.component.html'
})
export class CertificateWidgetComponent {
    device: IManagedObject;
    cert = {
        application: 'Foo',
        serialNumber: 'bar',
        authority: 'jens',
        issueDate: new Date().toISOString(),
        expirationDate: new Date().toISOString(),
        isActive: true
    };

    constructor(
        route: ActivatedRoute, 
        private bsModalService: BsModalService, 
        private modal: ModalService,
        private devityProxy: DevityProxyService) {
        this.device = route.snapshot.parent?.data["contextData"];

        this.devityProxy.getDevices().then(devices => {
            console.log(devices); // TODO: find the one device who's serialNumber matches the name of this mo
           return this.devityProxy.getCertificates(devices[0].guid);
        }).then(certificates => {
            console.log(certificates); // TODO: find the certificate where the expiry date is the largest number (latest)
        });

        this.devityProxy.getCertificateAuthorities().then(cas => {
          console.log(cas);
        });
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