import { Component, EventEmitter, Input } from '@angular/core';
import {
  ActionControl,
  AlertService,
  BuiltInActionType,
  Column,
  gettext,
  Pagination,
} from '@c8y/ngx-components';
import { PKIProvider } from '~models/pki-provider.model';
import { IssuingCA } from '~models/rest-reponse.model';
import { CertificateAuhtorityActionService } from '~services/certificate-authority-action.service';
import { DevityProxyService } from '~services/devity-proxy.service';
import { KeynoaService } from '~services/keynoa.service';

@Component({
  selector: 'devity-certificate-authority-list',
  templateUrl: './certificate-authority-list.component.html',
  standalone: false,
})
export class DevityCertificateAuthorityListComponent {
  /** Provider ID */
  @Input() set id(value: string | number) {
    if (value) {
      this._providerId = value;
      this.reload();
    }
  }
  private _providerId: string | number;
  provider: PKIProvider;

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
    },
    {
      name: 'status',
      header: gettext('Status'),
    },
  ];
  pagination: Pagination = {
    pageSize: 50,
    currentPage: 1,
  };
  actions: ActionControl[] = [
    {
      type: 'Download',
      icon: 'download',
      callback: (cert: IssuingCA) => this.onDownloadCert(cert),
      showIf: (cert: IssuingCA) => !!cert.caCertificate,
    },
    {
      type: BuiltInActionType.Delete,
      callback: () => this.onDeleteCertAuthority(),
    },
  ];

  rows: IssuingCA[] = [];

  constructor(
    private keynoaService: KeynoaService,
    private proxyService: DevityProxyService,
    private alert: AlertService,
    private caActionService: CertificateAuhtorityActionService
  ) {}

  async reload() {
    try {
      this.provider = await this.keynoaService.getProvider(this._providerId);
      const caId = this.provider.caId;
      const cas = await this.proxyService.getCertificateAuthorities();
      const cert = cas.find((ca) => ca.id === caId);
      if (cert) {
        this.rows = [cert];
      } else {
        // TODO: remove this fallback before fair!!
        this.rows = cas.map((cert) => ({ ...cert }));
      }
    } catch (e) {
      this.alert.danger('Could not load CAs.', `${e}`);
    }
  }

  onDownloadCert(cert: IssuingCA): void {
    this.caActionService.download(cert);
  }

  async onDeleteCertAuthority() {
    const res = await this.caActionService.delete(this.provider.caId);
    if (this.provider) {
      if (this.provider.c8yConfigId) {
        this.proxyService.deleteCumulocityConfig(this.provider.c8yConfigId);
      }
      if (this.provider.thinEdgeConfigId) {
        this.proxyService.deleteThinEdgeConfig(this.provider.thinEdgeConfigId);
      }
    }
    if (res.status === 'success') {
      await this.reload();
      this.refresh.next();
    }
  }
}
