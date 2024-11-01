import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule, hookNavigator, hookRoute } from '@c8y/ngx-components';
import { FormlyModule } from '@ngx-formly/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ADMIN_PKI_PROVIDER_PATH } from '~models/app-admin.model';
import { DevityAdminPKIProviderModalComponent } from './components/admin-pki-provider-modal/admin-pki-provider-modal.component';
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
  ],
  providers: [
    hookRoute({
      path: ADMIN_PKI_PROVIDER_PATH,
      component: DevityPKIProviderComponent,
    }),
    // TODO hook tab
    hookNavigator({
      // parent: '',
      priority: 6000,
      path: ADMIN_PKI_PROVIDER_PATH,
      label: 'PKI Provider',
      icon: 'deploy',
      preventDuplicates: true,
    }),
  ],
})
export class DevityAdminModule {}
