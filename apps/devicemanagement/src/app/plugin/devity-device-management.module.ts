import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@c8y/ngx-components';
import { FormlyModule } from '@ngx-formly/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DevityDeviceDetails } from './components/device-details/device-details.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    FormsModule,
    FormlyModule.forChild(),
    CollapseModule,
  ],
  declarations: [DevityDeviceDetails],
  providers: [
    // hookRoute({
    //   path: RELEASE_NOTES_PATH,
    //   component: ReleaseNotesAdminComponent,
    // }),
    // hookNavigator({
    //   parent: 'Configuration',
    //   priority: 1000,
    //   path: RELEASE_NOTES_PATH,
    //   label: 'Release Notes',
    //   icon: 'activity-history',
    //   preventDuplicates: true,
    // }),
  ],
})
export class DevityDeviceManagementModule {}
