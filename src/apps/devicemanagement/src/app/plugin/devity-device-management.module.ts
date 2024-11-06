import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule, gettext, hookComponent } from '@c8y/ngx-components';
import { FormlyModule } from '@ngx-formly/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DevityDeviceDetails } from './components/device-details/device-details.component';
import { CertificateWidgetComponent } from './components/certificate-widget/certificate-widget.component';
import { CertificateConfigWidgetComponent } from './components/certificate-widget/certificate-widget-config.component';
import { assetPaths } from '../../assets/assets';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    FormsModule,
    FormlyModule.forChild(),
    CollapseModule,
  ],
  declarations: [DevityDeviceDetails, CertificateWidgetComponent, CertificateConfigWidgetComponent],
  providers: [
    hookComponent({
      id: 'devity.certificate.widget',
      label: gettext('Certificate Widget'),
      description: gettext('Revoke or renew certificates'),
      component: CertificateWidgetComponent,
      previewImage: assetPaths.previewImage,
      configComponent: CertificateConfigWidgetComponent,
      data: {
        settings: {
          noNewWidgets: false,
          ng1: {
            options: {
              noDeviceTarget: true,
              deviceTargetNotRequired: true,
              groupsSelectable: false,
            },
          },
          // widgetDefaults: {
          //   _width: 4,
          //   _height: 8,
          // },
        },
      },
    })
  ]
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
})
export class DevityDeviceManagementModule {}
