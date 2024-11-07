import { Column, ColumnDataType } from '@c8y/ngx-components';
import { CertificateAssetCellRendererComponent } from '~components/cells/certificate-asset.cell';
import { DateCellRendererComponent } from '~components/cells/date.cell';
import { RelativeDateCellRendererComponent } from '~components/cells/relative-date.cell';
import { CertificateStatusColumn } from '~components/columns/certificate-status.column';

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
    name: 'application',
    header: 'Application',
    path: 'appInstanceId',
    filterable: false,
    sortable: false,
    dataType: ColumnDataType.TextShort,
    gridTrackSize: '120px',
  },
  {
    name: 'certificateSerialNumber',
    header: 'Certificate Serial Number',
    path: 'certificateSerialNumber',
    filterable: false,
    sortable: false,
    dataType: ColumnDataType.TextShort,
  },
  {
    name: 'issuingCA',
    header: 'issuing CA',
    path: 'authoritySubjectCn',
    filterable: false,
    sortable: false,
    dataType: ColumnDataType.TextShort,
  },
  {
    name: 'issueDate',
    header: 'Issue Date',
    path: 'issuedAt',
    filterable: false,
    sortable: false,
    cellRendererComponent: DateCellRendererComponent,
  },
  {
    name: 'expiration',
    header: 'Expiration',
    path: 'expiredAt',
    filterable: false,
    sortable: false,
    cellRendererComponent: RelativeDateCellRendererComponent,
    gridTrackSize: '100px',
  },
  new CertificateStatusColumn(),
];
