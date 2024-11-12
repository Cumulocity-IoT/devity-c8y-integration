import { BaseColumn, ColumnConfig } from '@c8y/ngx-components';
import { CertificateStatusCellRendererComponent } from '~components/cells/certificate-status.cell';

export class CertificateStatusColumn extends BaseColumn {
  constructor(initialColumnConfig?: ColumnConfig) {
    super(initialColumnConfig);
    this.name = 'certificate-status';
    this.path = '';
    this.header = 'Status';
    this.cellRendererComponent = CertificateStatusCellRendererComponent;
    this.sortable = false;
    this.filterable = false;
    this.gridTrackSize = '100px';
    // TODO filter…
    // this.filteringFormRendererComponent =
      // CertificateStatusFilterRendererComponent;
  }
}
