import { Injectable } from "@angular/core";
import { MicroserviceService } from "./microservice.service";
import { HttpResponse } from "@angular/common/http";

export type ProxyRequest = {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers: { [key: string]: string },
    body: object;
}

export type ProxyResponse<T> = {
    request: ProxyRequest,
    response: HttpResponse<T>
}

@Injectable({
    providedIn: 'root'
})
export class DevityProxyService {
    constructor (private ms: MicroserviceService) {}

    revokeCertificate(issuingCaId) {
        const url = `/issuingCAs/${issuingCaId}/revoke`;
        const request: ProxyRequest = {
            url,
            method: 'POST',
            headers: {},
            body: {}
        }
        return this.proxy(request);
    }

    private proxy<T>(request: ProxyRequest) {
        this.ms.post(`service/dtyProxy`, request, async(res) => {
            return res.json() as Promise<ProxyResponse<T>>;
        }
      );
    }
}