import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule, hookRoute, hookTab } from '@c8y/ngx-components';
import { FormlyModule } from '@ngx-formly/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ADMIN_PKI_PROVIDER_PATH } from '~models/app-admin.model';
import { DevityAdminPKIProviderModalComponent } from './components/admin-pki-provider-modal/admin-pki-provider-modal.component';
import { DevityCertificateAuthorityModalComponent } from './components/certificate-authority-modal/certificate-authority-modal.component';
import { PKIProviderTabFactory } from './components/pki-provider/pki-provider-tab.factory';
import { DevityPKIProviderComponent } from './components/pki-provider/pki-provider.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    FormsModule,
    FormlyModule.forChild(),
    CollapseModule,
  ],
  declarations: [
    DevityPKIProviderComponent,
    DevityAdminPKIProviderModalComponent,
    DevityCertificateAuthorityModalComponent,
  ],
  providers: [
    hookRoute({
      path: ADMIN_PKI_PROVIDER_PATH,
      component: DevityPKIProviderComponent,
    }),
    hookTab(PKIProviderTabFactory),
  ],
})
export class DevityAdminModule {}
