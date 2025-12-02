import { Component, OnInit } from '@angular/core';
import { IManagedObject, InventoryService } from '@c8y/client';
import {
  ActionControl,
  AlertService,
  Pagination,
  Row,
} from '@c8y/ngx-components';
import { flatten, remove } from 'lodash';
import { CERTIFIACTE_LIST_COLUMNS } from '~models/certificate.model';
import {
  DevityCertificateStatus,
  DevityDevice,
  DevityDeviceCertificate,
  IssuingCA,
} from '~models/rest-reponse.model';
import { CertificateActionService } from '~services/certificate-action.service';
import { DevityProxyService } from '~services/devity-proxy.service';

interface UnionDevice extends IManagedObject {
  devity: DevityDevice;
}

interface CertificateStats {
  active: number;
  expiring: {
    [key: string]: number;
  };
  expired: {
    [key: string]: number;
  };
  revoked: {
    [key: string]: number;
  };
}

@Component({
  selector: 'certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrl: './certificate-list.component.scss',
  standalone: false,
})
export class CertificateListComponent implements OnInit {
  isLoading = true;
  isStatsLoading = true;

  // datagrid
  rows: Row[] = [];
  columns = CERTIFIACTE_LIST_COLUMNS;
  pagination: Pagination = {
    pageSize: 50,
    currentPage: 1,
  };
  actionControls: ActionControl[] = [
    {
      type: 'revoke',
      text: 'Revoke Certificate',
      icon: 'trash',
      iconClasses: 'text-danger',
      showOnHover: true,
      showIf: (row) => row.status === DevityCertificateStatus.VALID,
      callback: (row) => this.revoke(row),
    },
    // TODO: should be removed
    // {
    //   type: 'renew',
    //   text: 'Renew Certificate',
    //   icon: 'refresh',
    //   iconClasses: 'text-success',
    //   // showOnHover: true,
    //   showIf: (row) => row.status === DevityCertificateStatus.EXPIRED,
    //   callback: (row) => this.renew(row),
    // },
  ];

  // certificate stats
  stats: CertificateStats = null;
  lastUpdated: Date;

  private c8yDevices: IManagedObject[];
  private devityDevices: DevityDevice[];
  private unionDevices: UnionDevice[];
  private certificates: DevityDeviceCertificate[];
  private authorities: IssuingCA[];

  constructor(
    private inventoryService: InventoryService,
    private devityProxyService: DevityProxyService,
    private alertService: AlertService,
    private certActionService: CertificateActionService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.isLoading = true;
    this.isStatsLoading = true;
    // get all devices from all sources
    [this.c8yDevices, this.devityDevices, this.authorities] = await Promise.all(
      [
        this.fetchC8yDevices(),
        this.devityProxyService.getDevices(),
        this.devityProxyService.getCertificateAuthorities(),
      ]
    );
    this.unionDevices = this.filterCommonDevices();

    // get certificates per device
    this.certificates = await this.fetchDevityCerificates();
    this.rows = this.generateRows();
    this.isLoading = false;

    (this.stats = await this.fetchStats()),
      console.log('reload', {
        c8yDevices: this.c8yDevices,
        devityDevices: this.devityDevices,
        unionDevices: this.unionDevices,
        certificates: this.certificates,
        authorities: this.authorities,
        rows: this.rows,
        stats: this.stats,
      });

    this.lastUpdated = new Date();
    this.isStatsLoading = false;
  }

  async renew(certificateRow: Row): Promise<void> {
    console.log('renew', certificateRow);
    this.alertService.info('Not Yet Implemented');
  }

  revoke(certificateRow: Row): void {
    this.certActionService
      .revoke(
        certificateRow.issuingCaId,
        certificateRow.certificateSerialNumber
      )
      .then((res) => {
        if (res.status === 'success') {
          void this.reload();
        } else if (res.status === 'error') {
          console.error(res.error);
        }
      });
  }

  // expecting lt 2k devices for the demo…
  private async fetchC8yDevices(pageSize = 2000): Promise<IManagedObject[]> {
    try {
      const res = await this.inventoryService.list({
        query: '$filter=(has(c8y_IsDevice))',
        pageSize,
      });

      if (res.data && res.data.length) return res.data;
    } catch (error) {
      console.error(error);
    }

    return [];
  }

  private async fetchDevityCerificates(
    unionDevices = this.unionDevices
  ): Promise<DevityDeviceCertificate[]> {
    if (!unionDevices || unionDevices.length < 1) return [];

    const requests = [];
    const deviceList = {};

    unionDevices.forEach((device) => {
      requests.push(
        this.devityProxyService.getCertificates(
          device.devity.guid,
          'thin-edge1'
        )
      );
      deviceList[device.devity.guid] = device;
    });

    try {
      const res = await Promise.all(requests);

      return flatten(res);
    } catch (error) {
      console.error(error);
    }

    return [];
  }

  private async fetchStats(
    authorities = this.authorities
  ): Promise<CertificateStats> {
    console.log('fetchStats', authorities);

    const stats = {
      active: 0,
      expiring: {
        lt2d: 0,
        lt7d: 0,
      },
      expired: {
        lt7d: 0,
      },
      revoked: {
        lt7d: 0,
      },
    };
    const requests = [];

    for (const auth of authorities) {
      if (!auth.caCertificate?.fingerprint) {
        console.warn(
          `Authority ${auth.caName} has no CA certificate assigned. Skipping...`
        );
        continue;
      }

      const fingerprint = auth.caCertificate?.fingerprint;
      requests.push(
        this.devityProxyService.getValidCertificates(fingerprint), // 0
        this.devityProxyService.getExpiringCertificates(fingerprint, 2), // 1
        this.devityProxyService.getExpiringCertificates(fingerprint, 7), // 2
        this.devityProxyService.getExpiredCertificates(fingerprint, 7), // 3
        this.devityProxyService.getRevokedCertificates(fingerprint, 7) // 4
      );
    }

    try {
      const responses = await Promise.all(requests);
      console.log('responses', responses);

      responses.forEach((auth, index) => {
        console.log(auth, index % 5);
        switch (index % 5) {
          case 0:
            // getValidCertificates
            stats.active += auth.length;
            break;
          case 1:
            // getExpiringCertificates 2d
            stats.expiring['lt2d'] += auth.length;
            break;
          case 2:
            // getExpiringCertificates 7d
            stats.expiring['lt7d'] += auth.length;
            break;
          case 3:
            // getExpiredCertificates 7d
            stats.expired['lt7d'] += auth.length;
            break;
          case 4:
            // getRevokedCertificates 7d
            stats.revoked['lt7d'] += auth.length;
            break;
        }
      });
    } catch (error) {
      console.error(error);
    }

    console.log('stats', stats);

    return stats;
  }

  private filterCommonDevices(
    c8yDevices = this.c8yDevices,
    devityDevices = this.devityDevices
  ): UnionDevice[] {
    return remove(
      c8yDevices.map((c8yDevice) => {
        const devityDevice = devityDevices.find(
          (devity) => devity.serialNumber === c8yDevice.name
        );

        if (devityDevice) return { ...c8yDevice, ...{ devity: devityDevice } };
      }),
      (d) => d
    );
  }

  private generateRows(
    certificates = this.certificates,
    unionDevices = this.unionDevices
  ): Row[] {
    let row: Row;
    let device: UnionDevice;
    let authority: IssuingCA;

    return certificates.map((certificate) => {
      // minimal row data set (& reset)
      row = {
        ...certificate,
        status: this.generateCertificateStatus(certificate),
        id: certificate.certificateSerialNumber,
      };

      // find related data
      authority = this.authorities.find(
        (auth) => auth.caCertificate?.fingerprint === certificate.caFingerprint
      );
      device = unionDevices.find(
        (device) => device.devity.guid === certificate.deviceGuid
      );

      // pushing additional data into the certificate MO
      return {
        ...row,
        ...{
          device,
          authoritySubjectCn: authority?.caCertificate?.subjectCn,
          issuingCaId: authority?.id,
        },
      } as Row;
    });
  }

  // easier digestable status
  private generateCertificateStatus(
    certificate: DevityDeviceCertificate
  ): DevityCertificateStatus {
    const now = new Date().getTime();

    if (!!certificate.revokedAt) {
      return DevityCertificateStatus.REVOKED;
    } else if (certificate.expiredAt <= now) {
      return DevityCertificateStatus.EXPIRED;
    } else {
      return DevityCertificateStatus.VALID;
    }
  }
}
