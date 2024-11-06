import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Tab, TabFactory } from '@c8y/ngx-components';
import { ADMIN_PKI_PROVIDER_PATH } from '~models/app-admin.model';

@Injectable()
export class PKIProviderTabFactory implements TabFactory {
  constructor(public router: Router) {}

  get() {
    const tabs: Tab[] = [];

    if (this.router.url.match(/\/auth-configuration/g)) {
      tabs.push({
        path: ADMIN_PKI_PROVIDER_PATH,
        priority: 1000,
        label: 'PKI Provider',
        icon: 'key',
      } as Tab);
    }

    return tabs;
  }
}
