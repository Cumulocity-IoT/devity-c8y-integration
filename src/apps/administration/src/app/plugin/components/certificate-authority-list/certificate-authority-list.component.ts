import { Component, EventEmitter, Input } from '@angular/core';
import { ActionControl, AlertService, Column, gettext, Pagination } from '@c8y/ngx-components';
import { DevityCertificateData } from '~models/rest-reponse.model';
import { CertificateAuhtorityActionService } from '~services/certificate-authority-action.service';
import { DevityProxyService } from '~services/devity-proxy.service';
import { KeynoaService } from '~services/keynoa.service';

@Component({
  selector: 'devity-certificate-authority-list',
  templateUrl: './certificate-authority-list.component.html',
})
export class DevityCertificateAuthorityListComponent {
  /** Provider ID */
  @Input() set id(value: string | number) {
    if (value) {
      this._providerId = value;
      this.reload();
    }
  }
  _providerId: string | number;

  /** Takes an event emitter. When an event is emitted, the grid will be reloaded. */
  refresh = new EventEmitter<void>();

  columns: Column[] = [
      {
          name: 'subjectcn',
          header: gettext('Subject CN'),
          path: 'subjectCn',
      },
      {
          name: 'organization',
          header: gettext('Organization'),
          path: 'subOrganization',
      },
      {
          name: 'name',
          header: gettext('Name'),
          path: 'caName',
      },
      {
          name: 'expirationdate',
          header: gettext('Expiration Date'),
          path: 'expirationTime',
      },
      {
          name: 'issuercn',
          header: gettext('Issuer CN'),
          path: 'issuerCn',
      },
      {
          name: 'publickeyalg',
          header: gettext('Public Key Alg'),
          path: 'algorithm',
      }
  ];
  pagination: Pagination = {
    pageSize: 50,
    currentPage: 1,
  };
  actions: ActionControl[] = [
      {
      type: 'Download',
      icon: 'download',
      callback: (cert: DevityCertificateData) => this.onDownloadCert(cert),
      },
  ];
  
  rows: (DevityCertificateData & { id: string })[] = [];

  constructor(
      private keynoaService: KeynoaService,
      private proxyService: DevityProxyService, 
      private alert: AlertService,
      private caActionService: CertificateAuhtorityActionService
  ) {}

  async reload() {
    try {
      const caIDs = (await this.keynoaService.getProvider(this._providerId)).caIds;
      const cas = await this.proxyService.getCertificateAuthorities();
      const casCreatedByC8y = cas.filter(ca => caIDs?.includes(ca.caId));
      if (casCreatedByC8y.length) {
        this.rows = casCreatedByC8y.map(cert => ({ ...cert, id: cert.caId.toString()}));
      } else {
        // TODO: remove this fallback before fair!!
        this.rows = cas.map(cert => ({ ...cert, id: cert.caId.toString()}));
      }

      // const issuingCA = await this.proxyService.getIssuingCA(caID);
      //     console.log(issuingCA.caCertificateId);
    } catch (e) {
      this.alert.danger('Could not load CAs.', `${e}`);
    }
  }

  onDownloadCert(cert: DevityCertificateData): void {
     this.caActionService.download(cert);
  }
}
