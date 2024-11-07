import { Column, ColumnDataType, Pagination } from '@c8y/ngx-components';
import { CertificateAssetCellRendererComponent } from '~components/cells/certificate-asset.cell';
import { DateCellRendererComponent } from '~components/cells/date.cell';
import { RelativeDateCellRendererComponent } from '~components/cells/relative-date.cell';
import { CertificateStatusColumn } from '~components/columns/certificate-status.column';

export const CERTIFICATE_PAGINATION: Pagination = {
  pageSize: 10,
  currentPage: 1,
};

export const CERTIFIACTE_LIST_COLUMNS: Column[] = [
  // device                     » deviceGuid
  // application                » appInstanceId
  // certificate serial number  » certificateSerialNumber
  // issuing ca                 » caFingerprint
  // issue date                 » issuedAt
  // expiration                 » expiredAt
  // status                     » revokedAt
  // revoke certificate (action)
  {
    name: 'device',
    header: 'Device',
    path: 'device.name',
    filterable: false,
    sortable: false,
    cellRendererComponent: CertificateAssetCellRendererComponent,
  },
  {
    name: 'appInstanceId',
    header: 'Application',
    path: 'appInstanceId',
    filterable: false,
    sortable: false,
    dataType: ColumnDataType.TextShort,
  },
  {
    name: 'certificateSerialNumber',
    header: 'Certificate Seria lNumber',
    path: 'certificateSerialNumber',
    filterable: false,
    sortable: false,
    dataType: ColumnDataType.TextShort,
  },
  {
    name: 'caFingerprint',
    header: 'issuing CA',
    path: 'caFingerprint',
    filterable: false,
    sortable: false,
    dataType: ColumnDataType.TextShort,
  },
  {
    name: 'issuedAt',
    header: 'Issue Date',
    path: 'issuedAt',
    filterable: false,
    sortable: false,
    cellRendererComponent: DateCellRendererComponent,
  },
  {
    name: 'expiredAt',
    header: 'Expiration',
    path: 'expiredAt',
    filterable: false,
    sortable: false,
    cellRendererComponent: RelativeDateCellRendererComponent,
  },
  new CertificateStatusColumn(),
];
