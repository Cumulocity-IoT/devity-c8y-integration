import { BaseColumn, ColumnConfig } from '@c8y/ngx-components';
import { CertificateStatusCellRendererComponent } from '~components/cells/certificate-status.cell';
import { CertificateStatusFilterRendererComponent } from '~components/filter/certificate-status.filter';

export class CertificateStatusColumn extends BaseColumn {
  constructor(initialColumnConfig?: ColumnConfig) {
    super(initialColumnConfig);
    this.name = 'certificate-status';
    this.path = '';
    this.header = 'Status';
    this.cellRendererComponent = CertificateStatusCellRendererComponent;
    this.sortable = false;
    this.filterable = true;
    this.gridTrackSize = '100px';
    this.filteringFormRendererComponent =
      CertificateStatusFilterRendererComponent;
  }
}
