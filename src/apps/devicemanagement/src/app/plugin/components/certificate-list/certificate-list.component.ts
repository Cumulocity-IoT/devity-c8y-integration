import { Component, OnInit } from '@angular/core';
import { IManagedObject, InventoryService } from '@c8y/client';
import { Row } from '@c8y/ngx-components';
import { flatten, remove } from 'lodash';
import {
  CERTIFIACTE_LIST_COLUMNS,
  CERTIFICATE_PAGINATION,
} from '~models/certificate.model';
import {
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
})
export class CertificateListComponent implements OnInit {
  isLoading = true;

  // datagrid
  rows: Row[] = [];
  columns = CERTIFIACTE_LIST_COLUMNS;
  pagination = CERTIFICATE_PAGINATION;

  private c8yDevices: IManagedObject[];
  private devityDevices: DevityDevice[];
  private unionDevices: UnionDevice[];
  private certificates: DevityDeviceCertificate[];

  constructor(
    private inventoryService: InventoryService,
    private devityProxyService: DevityProxyService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.isLoading = true;
    // get all devices from all sources
    [this.c8yDevices, this.devityDevices] = await Promise.all([
      this.fetchC8yDevices(),
      this.devityProxyService.getDevices(),
    ]);
    this.unionDevices = this.filterCommonDevices();

    // get certificates per device
    this.certificates = await this.fetchDevityCerificates();
    this.rows = this.generateRows();

    console.log('reload', {
      c8yDevices: this.c8yDevices,
      devityDevices: this.devityDevices,
      unionDevices: this.unionDevices,
      certificates: this.certificates,
      rows: this.rows
    });
    this.isLoading = false;
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

    return certificates.map((certificate) => {
      row = {
        ...certificate,
        id: certificate.certificateSerialNumber
      }
      device = unionDevices.find((device) => device.devity.guid === certificate.deviceGuid)

      return { ...row, ...{ device } } as Row;
    })
  }
}
