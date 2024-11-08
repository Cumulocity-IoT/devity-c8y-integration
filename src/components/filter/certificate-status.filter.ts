import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FilteringFormRendererContext } from '@c8y/ngx-components';

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

  constructor(public context: FilteringFormRendererContext) {
    console.log('constructor', context);
  }

  ngOnInit() {
    const activeFilters = this.context.property.externalFilterQuery as object[];

    console.log('init', activeFilters);

    if (!activeFilters?.length) return;

    // TODO filter
  }

  applyFilter() {
    const activeFilters: object[] = [];

    this.context.applyFilter({
      externalFilterQuery: activeFilters,
    });
  }

  resetFilter() {
    this.context.resetFilter();
  }
}
