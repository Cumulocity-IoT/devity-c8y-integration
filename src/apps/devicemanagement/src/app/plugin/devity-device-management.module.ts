import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  CoreModule,
  gettext,
  hookComponent,
  hookNavigator,
  hookRoute,
} from '@c8y/ngx-components';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CERTIFICATES_LIST_PATH } from '~models/app-dm.model';
import { assetPaths } from '../../assets/assets';
import { CertificateListComponent } from './components/certificate-list/certificate-list.component';
import { CertificateConfigWidgetComponent } from './components/certificate-widget/certificate-widget-config.component';
import { CertificateWidgetComponent } from './components/certificate-widget/certificate-widget.component';
import { DevityDeviceDetails } from './components/device-details/device-details.component';
import { IntervalRefreshComponent } from "~components/interval/interval-refresh.component";
import { SPSLoadingComponent } from '~components/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    RouterModule,
    FormsModule,
    TooltipModule,
    CollapseModule,
    IntervalRefreshComponent,
    SPSLoadingComponent
],
  declarations: [
    DevityDeviceDetails,
    CertificateWidgetComponent,
    CertificateConfigWidgetComponent,
    CertificateListComponent,
  ],
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
    }),
    // list of certificates
    hookRoute({
      path: CERTIFICATES_LIST_PATH,
      component: CertificateListComponent,
    }),
    hookNavigator({
      parent: 'Overviews',
      priority: 1000,
      path: CERTIFICATES_LIST_PATH,
      label: 'Certificates',
      icon: 'key',
      preventDuplicates: true,
    }),
  ],
})
export class DevityDeviceManagementModule {}
