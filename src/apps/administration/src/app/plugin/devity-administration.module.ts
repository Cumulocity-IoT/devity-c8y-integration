import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule, hookRoute, hookTab } from '@c8y/ngx-components';
import { FormlyModule } from '@ngx-formly/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ADMIN_PKI_PROVIDER_PATH } from '~models/app-admin.model';
import { DevityAdminPKIProviderModalComponent } from './components/admin-pki-provider-modal/admin-pki-provider-modal.component';
import { DevityCertificateAuthorityListComponent } from './components/certificate-authority-list/certificate-authority-list.component';
import { DevityCertificateAuthorityModalComponent } from './components/certificate-authority-modal/certificate-authority-modal.component';
import { PKIProviderTabFactory } from './components/pki-provider/pki-provider-tab.factory';
import { DevityPKIProviderComponent } from './components/pki-provider/pki-provider.component';
import { IsFutureDatePipe } from './components/certificate-authority-list/is-expired.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyFieldMultiSelect } from '~components/formly/multi-select.type.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    FormsModule,
    NgSelectModule,
    FormlyModule.forRoot({
      types: [
        { name: 'multi-select', component: FormlyFieldMultiSelect }
      ]
    }),
    CollapseModule,
  ],
  declarations: [
    DevityPKIProviderComponent,
    DevityAdminPKIProviderModalComponent,
    DevityCertificateAuthorityModalComponent,
    DevityCertificateAuthorityListComponent,
    IsFutureDatePipe,
    FormlyFieldMultiSelect
  ],
  providers: [
    hookRoute({
      path: ADMIN_PKI_PROVIDER_PATH,
      component: DevityPKIProviderComponent,
      children: [
        {
          path: '**',
          component: DevityPKIProviderComponent,
          data: {
            ca: true,
          },
        },
      ],
    }),
    hookTab(PKIProviderTabFactory),
  ],
})
export class DevityAdminModule {}
