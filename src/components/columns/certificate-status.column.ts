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

    /*
    this.filteringConfig = {
      fields: [
        {
          key: 'notC8y',
          type: 'checkbox',
          templateOptions: {
            label: 'NOT Cumulocity registered',
            attributes: {
              class: 'filter-icon error-warning--error',
            },
          },
          defaultValue: false,
        },
        {
          key: 'notTalk2m',
          type: 'checkbox',
          templateOptions: {
            label: 'NOT Talk2M registered',
            attributes: {
              class: 'filter-icon error-warning--warning',
            },
          },
          defaultValue: false,
        },
      ],
      getFilter(model: { notTalk2m: boolean; notC8y: boolean }) {
        const filter = { __or: [] };

        if (model.notTalk2m) {
          filter.__or.push({
            __eq: { talk2m_integrated: model.notTalk2m ? 'yes' : 'no' },
          });
        }

        if (model.notC8y) {
          filter.__or.push({
            __eq: { registered: model.notC8y ? 'yes' : 'no' },
          });
        }

        return filter;
      },
    };
  */
  }
}
