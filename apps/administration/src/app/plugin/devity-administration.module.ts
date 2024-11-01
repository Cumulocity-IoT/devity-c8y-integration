import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule, hookNavigator, hookRoute } from '@c8y/ngx-components';
import { FormlyModule } from '@ngx-formly/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DevityAdminComponent } from './components/admin/admin.component';
import { ADMIN_PATH } from '../../../../../src/models/app-admin.model';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    FormsModule,
    FormlyModule.forChild(),
    CollapseModule,
  ],
  declarations: [DevityAdminComponent],
  providers: [
    hookRoute({
      path: ADMIN_PATH,
      component: DevityAdminComponent,
    }),
    hookNavigator({
      // parent: '',
      priority: 6000,
      path: ADMIN_PATH,
      label: 'Devity',
      icon: 'deploy',
      preventDuplicates: true,
    }),
  ],
})
export class DevityAdminModule {}
