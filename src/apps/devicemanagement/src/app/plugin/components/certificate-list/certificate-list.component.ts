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
  DevityCertificateData,
  DevityCertificateStatus,
  DevityDevice,
  DevityDeviceCertificate,
} from '~models/rest-reponse.model';
import { DevityProxyService } from '~services/devity-proxy.service';

interface UnionDevice extends IManagedObject {
  devity: DevityDevice;
}

@Component({
  selector: 'certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrl: './certificate-list.component.scss',
})
export class CertificateListComponent implements OnInit {
  isLoading = true;

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
    {
      type: 'renew',
      text: 'Renew Certificate',
      icon: 'refresh',
      iconClasses: 'text-success',
      // showOnHover: true,
      showIf: (row) => row.status === DevityCertificateStatus.EXPIRED,
      callback: (row) => this.renew(row),
    },
  ];

  private c8yDevices: IManagedObject[];
  private devityDevices: DevityDevice[];
  private unionDevices: UnionDevice[];
  private certificates: DevityDeviceCertificate[];
  private authorities: DevityCertificateData[];

  constructor(
    private inventoryService: InventoryService,
    private devityProxyService: DevityProxyService,
    private alertService: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.isLoading = true;
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

    console.log('reload', {
      c8yDevices: this.c8yDevices,
      devityDevices: this.devityDevices,
      unionDevices: this.unionDevices,
      certificates: this.certificates,
      authorities: this.authorities,
      rows: this.rows,
    });
    this.isLoading = false;
  }

  async renew(certificateRow: Row): Promise<void> {
    console.log('renew', certificateRow);
  }

  async revoke(certificateRow: Row): Promise<void> {
    console.log('revoke', certificateRow);

    try {
      await this.devityProxyService.revokeCertificate(
        certificateRow.issuingCaId,
        {
          serial_number: certificateRow.certificateSerialNumber,
        }
      );

      this.alertService.success(
        `Certificate ${certificateRow.certificateSerialNumber} revoked. It might take several minutes for the action to be completed.`
      );
    } catch (error) {
      this.alertService.danger('Could not revoke Certificate', error as string);
      console.error(error);
    }
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
        this.devityProxyService.getCertificates(device.devity.guid)
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
    let authority: DevityCertificateData;

    return certificates.map((certificate) => {
      // minimal row data set (& reset)
      row = {
        ...certificate,
        status: this.generateCertificateStatus(certificate),
        id: certificate.certificateSerialNumber,
      };

      // find related data
      authority = this.authorities.find(
        (auth) => auth.fingerprint === certificate.caFingerprint
      );
      device = unionDevices.find(
        (device) => device.devity.guid === certificate.deviceGuid
      );

      // pushing additional data into the certificate MO
      return {
        ...row,
        ...{
          device,
          authoritySubjectCn: authority?.subjectCn,
          issuingCaId: authority?.caId,
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
