import { Injectable } from '@angular/core';
import {
  AlertService,
  gettext,
  ModalService,
  Status,
} from '@c8y/ngx-components';
import { DevityProxyService } from './devity-proxy.service';
import {
  CertificateAuthorityConfig,
  IssuingCA,
} from '~models/rest-reponse.model';
import { saveAs } from 'file-saver';

export type ActionResult =
  | { status: 'success' | 'canceled' }
  | { status: 'error'; error: unknown };

@Injectable({
  providedIn: 'root',
})
export class CertificateAuhtorityActionService {
  constructor(
    private modal: ModalService,
    private alertService: AlertService,
    private devityProxyService: DevityProxyService
  ) {}

  async create(
    caName: string,
    authoritiy: CertificateAuthorityConfig
  ): Promise<ActionResult> {
    try {
      try {
        await this.devityProxyService.createCertificateAuthority(
          caName,
          authoritiy
        );
        this.alertService.success(
          `Certificate Authority ${caName} created. It might take several minutes for the action to be completed.`
        );
        return { status: 'success' };
      } catch (e) {
        this.alertService.danger(
          'Could not create Certificate Authority.',
          e as string
        );
        return { status: 'error', error: e };
      }
    } catch (e) {
      return { status: 'canceled' };
    }
  }

  async delete(caCertificateId: number): Promise<ActionResult> {
    try {
      await this.modal.confirm(
        'Delete certificate authority',
        'You are about to delete the certificate authority. Are you sure you want to continue?',
        Status.DANGER,
        {
          ok: gettext('Delete'),
        }
      );
      try {
        await this.devityProxyService.deleteCertificateAuthority(
          caCertificateId
        );
      } catch (e) {
        this.alertService.danger(
          'Could not delete Certificate Authority.',
          e as string
        );
        return { status: 'error', error: e };
      }
      return { status: 'success' };
    } catch (e) {
      return { status: 'canceled' };
    }
  }

  download(cert: IssuingCA) {
    let blob = new Blob([cert.caCertificate.certificate], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(blob, `${cert.caCertificate.subjectCn}.pem`);
  }
}
