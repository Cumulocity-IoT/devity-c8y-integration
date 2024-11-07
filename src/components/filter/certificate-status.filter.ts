import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilteringFormRendererContext } from '@c8y/ngx-components';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  standalone: true,
  selector: 'certificate-status-filter-renderer',
  templateUrl: './certificate-status.filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CertificateStatusFilterRendererComponent implements OnInit {
  // fields: [
  //   {
  //     key: 'valid';
  //     type: 'checkbox';
  //     templateOptions: {
  //       label: 'valid';
  //       attributes: {
  //         class: 'filter-icon certificate-status--valid';
  //       };
  //     };
  //     defaultValue: false;
  //   },
  //   {
  //     key: 'expired';
  //     type: 'checkbox';
  //     templateOptions: {
  //       label: 'expired';
  //       attributes: {
  //         class: 'filter-icon certificate-status--expired';
  //       };
  //     };
  //     defaultValue: false;
  //   },
  //   {
  //     key: 'revoked';
  //     type: 'checkbox';
  //     templateOptions: {
  //       label: 'revoked';
  //       attributes: {
  //         class: 'filter-icon certificate-status--revoked';
  //       };
  //     };
  //     defaultValue: false;
  //   },
  //   {
  //     key: 'unknown';
  //     type: 'checkbox';
  //     templateOptions: {
  //       label: 'unknown';
  //       attributes: {
  //         class: 'filter-icon certificate-status--unknown';
  //       };
  //     };
  //     defaultValue: false;
  //   }
  // ];

  form = new FormGroup({});

  model: {
    deviceStatus?: {
      inOperation: boolean;
      maintenance: boolean;
      warning: boolean;
      failure: boolean;
      stopped: boolean;
      offline: boolean;
    };
  } = {};

  fields: FormlyFieldConfig[] = [
    {
      type: 'object',
      key: 'deviceStatus',
      templateOptions: {
        label: 'grid.filter-label--default',
      },
      fieldGroup: [
        {
          key: 'inOperation',
          type: 'boolean',
          defaultValue: false,
          templateOptions: {
            label: 'device-status.status--in-operation',
            attributes: {
              class: 'filter-icon device-status--in-operation',
            },
          },
        },
      ],
    },
  ];

  constructor(public context: FilteringFormRendererContext) {
    const externalFilterQuery = context.property.externalFilterQuery as {
      model?: {
        deviceStatus: {
          inOperation: boolean;
          maintenance: boolean;
          warning: boolean;
          failure: boolean;
          stopped: boolean;
          offline: boolean;
        };
      };
    };

    this.model =
      externalFilterQuery && externalFilterQuery.model
        ? externalFilterQuery.model
        : {};
  }

  ngOnInit() {
    const column = this.context.property;

    this.form = column.filteringConfig.formGroup || new FormGroup({});
    this.model =
      column.externalFilterQuery || column.filteringConfig.model || {};
  }

  applyFilter() {
    console.log(this.fields);
    // this.context.resetFilter();

    this.context.applyFilter({
      externalFilterQuery: this.form.value as string | object,
    });
  }

  resetFilter() {
    this.context.resetFilter();
  }
}
