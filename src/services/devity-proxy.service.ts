import { Injectable } from "@angular/core";
import { MicroserviceService } from "./microservice.service";
import { DevityCertificateData, DevityDevice, DevityDeviceCertificate } from "~models/rest-reponse.model";

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

    getExpiringCertificates(caFingerprint: string, days: number) {
        const request: ProxyRequest = {
            url: `/appCertificates/expiring?caFingerprint=${caFingerprint}&daysAmount=${days}`,
            method: 'GET',
            headers: { "Accept":"application/json" },
            body: null
        };
        return this.proxy<DevityDeviceCertificate[]>(request);
    }

    getExpiredCertificates(caFingerprint: string, days: number) {
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