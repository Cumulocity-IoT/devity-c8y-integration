import { Injectable } from "@angular/core";
import { AlertService, gettext, ModalService, Status } from "@c8y/ngx-components";
import { BsModalService } from "ngx-bootstrap/modal";
import { DevityProxyService } from "./devity-proxy.service";
import { CertificateMoveModalComponent } from "~apps/devicemanagement/src/app/plugin/components/certificate-move-modal/certificate-move-modal.component";
import { firstValueFrom } from "rxjs";
import { DevityDevice, DevityDeviceApp } from "~models/rest-reponse.model";

export type ActionResult = { status: 'success' | 'canceled' } | { status: 'error', error: unknown };

@Injectable({
    providedIn: 'root'
})
export class CertificateActionService {

    constructor(
        private bsModalService: BsModalService, 
        private modal: ModalService,
        private alertService: AlertService,
        private devityProxyService: DevityProxyService ) {}

    async revoke(issuingCaId: number, certificateSerialNumber: string): Promise<ActionResult> {
        try {
            await this.modal.confirm(
              "Revoke certificate",
              "You are about to revoke the certificate. This will remove the device from the tenant.",
              Status.DANGER,
              {
                ok: gettext("Revoke"),
              },
            );

            try {
                await this.devityProxyService.revokeCertificate(
                    issuingCaId,
                    certificateSerialNumber
                  );
                  this.alertService.success(
                    `Certificate ${certificateSerialNumber} revoked. It might take several minutes for the action to be completed.`
                  );
                  return { status: 'success' };
            } catch (e) {
                this.alertService.danger('Could not revoke Certificate', e as string);
                return { status: 'error', error: e };
            }
          } catch (e) {
            return { status: 'canceled' };
          }
    }

    async renew(): Promise<ActionResult> {
        try {
            await this.modal.confirm(
              "Renew certificate",
              "You are about to renew the certificate. Are you sure you want to continue?",
              Status.WARNING,
              {
                ok: gettext("Renew"),
              },
            );
            return { status: 'success' };
          } catch (e) {
            return { status: 'canceled' };
          }
    }

    async move(
        app: DevityDeviceApp, 
        device: DevityDevice): Promise<ActionResult> {
        const configs = await this.devityProxyService.getThinEdgeConfigs();
        const ref = this.bsModalService.show(CertificateMoveModalComponent, { initialState: {
            configs,
            selectedConfigId: app.localConfigId
        } });
        const config = await firstValueFrom(ref.content.closeSubject);
        if (config) {
            try {
                debugger;
                await this.devityProxyService.moveDevice(app.appInstanceId, device.guid, config.id)
                return { status: 'success' };
            } catch(e) {
                return { status: 'error', error: e };
            }
        } else {
            return { status: 'canceled' };
        }
    }

}