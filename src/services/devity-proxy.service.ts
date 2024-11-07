import { Injectable } from "@angular/core";
import { MicroserviceService } from "./microservice.service";
import { CaCertificateDto, CumulocityConfiguration, DevityCertificateData, DevityDevice, DevityDeviceApp, DevityDeviceCertificate, ThinEdgeConfiguration, TrustAnchorCertificate } from "~models/rest-reponse.model";

export type ProxyRequest = {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers: { [key: string]: string },
    body: object | null;
}

export type ProxyResponse<T> = {
    request: ProxyRequest,
    response: { statuscode: number; body: T }
}

@Injectable({
    providedIn: 'root'
})
export class DevityProxyService {

    constructor (private ms: MicroserviceService) {}

    revokeCertificate(issuingCaId: string) {
        const url = `/issuingCAs/${issuingCaId}/revoke`;
        const request: ProxyRequest = {
            url,
            method: 'POST',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy(request);
    }

    getDevices() {
        const request: ProxyRequest = {
            url: '/devices',
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<DevityDevice[]>(request);
    }

    getCertificates(guid: DevityDevice['guid']) {
        const request: ProxyRequest = {
            url: `/appCertificates?guid=${guid}`,
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<DevityDeviceCertificate[]>(request);
    }

    getExpiringCertificates(caFingerprint: DevityCertificateData['fingerprint'], days: number) {
        const request: ProxyRequest = {
            url: `/appCertificates/expiring?caFingerprint=${caFingerprint}&daysAmount=${days}`,
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<DevityDeviceCertificate[]>(request);
    }

    getExpiredCertificates(caFingerprint: DevityCertificateData['fingerprint'], days: number) {
        const request: ProxyRequest = {
            url: `/appCertificates/expired?caFingerprint=${caFingerprint}&daysAmount=${days}`,
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<DevityDeviceCertificate[]>(request);
    }

    getCertificateAuthorities() {
        const request: ProxyRequest = {
            url: `/certificateAuthorities/listCA`,
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<DevityCertificateData[]>(request);
    }

    getAppInstances(guid: DevityDevice['guid']) {
        const request: ProxyRequest = {
            url: `/devices/${guid}/appInstances`,
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<DevityDeviceApp[]>(request);
    }

    getThinEdgeConfig(localConfigId: DevityDeviceApp['localConfigId']) {
        const request: ProxyRequest = {
            url: `/thinEdgeConfigurations/${localConfigId}`,
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<ThinEdgeConfiguration>(request);
    }

    getCumulocityConfig(cumulocityConfigurationId: ThinEdgeConfiguration['cumulocityConfigurationId']) {
        const request: ProxyRequest = {
            url: `/cumulocityConfigurations/${cumulocityConfigurationId}`,
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<CumulocityConfiguration>(request);
    }

    getCertificateAuthority(caId: CumulocityConfiguration['caId']) {
        const request: ProxyRequest = {
            url: `/certificateAuthorities/trustanchors/id/${caId}`,
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<CaCertificateDto>(request);
    }

    getTrustAnchor(cloudCaFingerprintPrimary: CumulocityConfiguration['cloudCaFingerprintPrimary']) {
        const request: ProxyRequest = {
            url: `/certificateAuthorities/trustanchors/fingerprint/${cloudCaFingerprintPrimary}`,
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<TrustAnchorCertificate>(request);
    }

    private proxy<T>(request: ProxyRequest): Promise<T> {
        return this.ms.post(`service/dty-proxy-ms/dtyProxy`, request).then((res: ProxyResponse<T>) => {
            if (res.response.statuscode >= 200 && res.response.statuscode <= 300) {
                return res.response.body;
            } else {
                return Promise.reject(res);
            }
        });
    }
}