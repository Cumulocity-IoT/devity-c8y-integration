import { Injectable } from '@angular/core';
import {
  CaCertificateDto,
  CertificateAuthorityConfig,
  CertificateAuthorityCreate,
  CertificateTemplate,
  CumulocityConfiguration,
  DevityDevice,
  DevityDeviceApp,
  DevityDeviceCertificate,
  IssuingCA,
  Permission,
  Role,
  ThinEdgeConfiguration,
  TrustAnchorCertificate,
} from '~models/rest-reponse.model';
import { MicroserviceService } from './microservice.service';

export type ProxyRequest = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: { [key: string]: string };
  body: string | null | object;
};

export type ProxyResponse<T> = {
  request: ProxyRequest;
  response: { statuscode: number; body: T };
};

@Injectable({
  providedIn: 'root',
})
export class DevityProxyService {
  constructor(private ms: MicroserviceService) {}

  revokeCertificate(
    issuingCaId: number,
    certificateSerialNumber: DevityDeviceCertificate['certificateSerialNumber']
  ) {
    const url = `/issuingCAs/${issuingCaId}/revoke`;
    const request: ProxyRequest = {
      url,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        serial_number: certificateSerialNumber,
      },
    };
    return this.proxy(request);
  }

  rotateIssuingCa(issuingCaId: number) {
    const url = `/issuingCAs/${issuingCaId}/crl/rotate`;
    const request: ProxyRequest = {
      url,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: null,
    };
    return this.proxy(request);
  }

  getIssuingCA(issuingCaId: number) {
    const url = `/issuingCAs/${issuingCaId}`;
    const request: ProxyRequest = {
      url,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<IssuingCA>(request);
  }

  renewDevice(guid: DevityDevice['guid']) {
    const request: ProxyRequest = {
      url: `/device/${guid}/renew`,
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy(request);
  }

  moveDevice(
    appInstanceId: DevityDeviceApp['appInstanceId'],
    deviceGuid: DevityDevice['guid'],
    localConfigId: number
  ) {
    const url = `/devices/switchConfig`;
    const request: ProxyRequest = {
      url,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        appInstanceId,
        configType: 'thin-edge',
        deviceGuid,
        localConfigId,
      },
    };
    return this.proxy(request);
  }

  getDevices() {
    const request: ProxyRequest = {
      url: '/devices',
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<DevityDevice[]>(request);
  }

  getCertificates(
    guid: DevityDevice['guid'],
    appInstanceId: DevityDeviceApp['appInstanceId']
  ) {
    const request: ProxyRequest = {
      url: `/deviceCertificates?guid=${guid}&appInstanceId=${appInstanceId}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<DevityDeviceCertificate[]>(request);
  }

  getExpiringCertificates(
    caFingerprint: CaCertificateDto['fingerprint'],
    days: number
  ) {
    const request: ProxyRequest = {
      url: `/deviceCertificates/expiring?caFingerprint=${caFingerprint}&daysAmount=${days}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<DevityDeviceCertificate[]>(request);
  }

  getExpiredCertificates(
    caFingerprint: CaCertificateDto['fingerprint'],
    days: number
  ) {
    const request: ProxyRequest = {
      url: `/deviceCertificates/expired?caFingerprint=${caFingerprint}&daysAmount=${days}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<DevityDeviceCertificate[]>(request);
  }

  getRevokedCertificates(
    caFingerprint: CaCertificateDto['fingerprint'],
    days: number
  ) {
    const request: ProxyRequest = {
      url: `/deviceCertificates/revoked?caFingerprint=${caFingerprint}&daysAmount=${days}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<DevityDeviceCertificate[]>(request);
  }

  getValidCertificates(caFingerprint: CaCertificateDto['fingerprint']) {
    const request: ProxyRequest = {
      url: `/deviceCertificates/valid?caFingerprint=${caFingerprint}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<DevityDeviceCertificate[]>(request);
  }

  getCertificateAuthorities() {
    const request: ProxyRequest = {
      url: `/issuingCAs`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<IssuingCA[]>(request);
  }

  getIssuingCAByCaCertificateId(caCertificateId: number) {
    const request: ProxyRequest = {
      url: `/issuingCAs?caCertificateId=${caCertificateId}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<IssuingCA[]>(request).then((cas) => cas[0]);
  }

  async getCertificateAuthority(
    issuingCaId: CumulocityConfiguration['issuingCaId']
  ) {
    const ca = await this.getIssuingCA(issuingCaId);
    const request: ProxyRequest = {
      url: `/trustAnchors/${ca.caCertificateId}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<CaCertificateDto>(request);
  }

  createCertificateAuthority(
    caName: string,
    authority: CertificateAuthorityConfig
  ) {
    const request: ProxyRequest = {
      url: `/issuingCAs/${caName}`,
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: authority,
    };
    return this.proxy<CertificateAuthorityCreate>(request);
  }

  getPermissions(groupId = 'cumulocity') {
    const request: ProxyRequest = {
      url: `/rbac/userGroups/${groupId}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<Permission>(request);
  }

  setPermissions(roles: Role['roleId'][], groupId = 'cumulocity') {
    const request: ProxyRequest = {
      url: `/rbac/userGroups/${groupId}`,
      method: 'PUT',
      headers: { Accept: 'application/json' },
      body: { resourceRoleIds: roles },
    };
    return this.proxy<Permission>(request);
  }

  getRolesForCA(id: IssuingCA['id']) {
    const request: ProxyRequest = {
      url: `/rbac/resourceRoles?entityName="issuingCA"?entityId=${id}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<Role[]>(request);
  }

  deleteCertificateAuthority(id: number) {
    const request: ProxyRequest = {
      url: `/issuingCAs/${id}`,
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy(request);
  }

  getAppInstances(guid: DevityDevice['guid']) {
    const request: ProxyRequest = {
      url: `/devices/${guid}/appInstances`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<DevityDeviceApp[]>(request);
  }

  createThinEdgeConfig(config: Omit<ThinEdgeConfiguration, 'id'>) {
    const request: ProxyRequest = {
      url: `/thinEdgeConfigurations`,
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: config,
    };
    return this.proxy<ThinEdgeConfiguration>(request);
  }

  deleteThinEdgeConfig(id: ThinEdgeConfiguration['id']) {
    const request: ProxyRequest = {
      url: `/thinEdgeConfigurations/${id}`,
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy(request);
  }

  createDeviceSelector(deviceSelector: {
    configId: ThinEdgeConfiguration['id'];
    configType: string;
    weight: number;
    patterns: { MODEL: string };
  }) {
    const request: ProxyRequest = {
      url: `/deviceSelectors`,
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: deviceSelector,
    };
    return this.proxy<ThinEdgeConfiguration>(request);
  }

  getThinEdgeConfig(localConfigId: DevityDeviceApp['localConfigId']) {
    const request: ProxyRequest = {
      url: `/thinEdgeConfigurations/${localConfigId}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<ThinEdgeConfiguration>(request);
  }

  getThinEdgeConfigs() {
    const request: ProxyRequest = {
      url: `/thinEdgeConfigurations`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<ThinEdgeConfiguration[]>(request);
  }

  createCumulocityConfig(config: Omit<CumulocityConfiguration, 'id'>) {
    const request: ProxyRequest = {
      url: `/cumulocityConfigurations`,
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: config,
    };
    return this.proxy<CumulocityConfiguration>(request);
  }

  deleteCumulocityConfig(id: CumulocityConfiguration['id']) {
    const request: ProxyRequest = {
      url: `/cumulocityConfigurations/${id}`,
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy(request);
  }

  getCumulocityConfig(
    cumulocityConfigurationId: ThinEdgeConfiguration['cumulocityConfigurationId']
  ) {
    const request: ProxyRequest = {
      url: `/cumulocityConfigurations/${cumulocityConfigurationId}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<CumulocityConfiguration>(request);
  }

  createCertificateTemplate(template: CertificateTemplate) {
    const request: ProxyRequest = {
      url: `/certificateTemplates`,
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: template,
    };
    return this.proxy<CertificateTemplate>(request);
  }

  getTrustAnchors(
    cloudCaFingerprintPrimary: CumulocityConfiguration['cloudCaFingerprintPrimary']
  ) {
    const request: ProxyRequest = {
      url: `/trustAnchors?fingerprint=${cloudCaFingerprintPrimary}`,
      method: 'GET',
      headers: { Accept: 'application/json' },
      body: null,
    };
    return this.proxy<TrustAnchorCertificate[]>(request);
  }

  private proxy<T>(request: ProxyRequest): Promise<T> {
    return this.ms
      .post(`service/dty-proxy-ms/dtyProxy`, request)
      .then((res: ProxyResponse<T>) => {
        if (res.response.statuscode >= 200 && res.response.statuscode <= 300) {
          return res.response.body;
        } else {
          return Promise.reject(res);
        }
      });
  }
}
