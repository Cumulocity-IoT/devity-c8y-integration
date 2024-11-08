import { Component, EventEmitter } from "@angular/core";
import { ActionControl, BulkActionControl, Column, gettext, Pagination } from "@c8y/ngx-components";
import { DevityCertificateData } from "~models/rest-reponse.model";
import { CertificateAuhtorityActionService } from "~services/certificate-authority-action.service";
import { DevityProxyService } from "~services/devity-proxy.service";
import { KeynoaService } from "~services/keynoa.service";
import { saveAs } from 'file-saver';

@Component({
    templateUrl: './certificate-authority-overview.component.html'
})
export class CAOverviewComponent {
    /** Takes an event emitter. When an event is emitted, the grid will be reloaded. */
    refresh = new EventEmitter<void>();

    columns: Column[] = [
        {
            name: 'subjectcn',
            header: gettext('Subject CN'),
            path: 'subjectCn',
        },
        {
            name: 'organization',
            header: gettext('Organization'),
            path: 'subOrganization',
        },
        {
            name: 'name',
            header: gettext('Name'),
            path: 'caName',
        },
        {
            name: 'expirationdate',
            header: gettext('Expiration Date'),
            path: 'expirationTime',
        },
        {
            name: 'issuercn',
            header: gettext('Issuer CN'),
            path: 'issuerCn',
        },
        {
            name: 'publickeyalg',
            header: gettext('Public Key Alg'),
            path: 'algorithm',
        }
    ];
    pagination: Pagination;
    actionControls: ActionControl[] = [
        {
        type: 'Download',
        icon: 'download',
        callback: (cert: DevityCertificateData) => this.onDownloadCert(cert),
        },
    ];
    bulkActionControls: BulkActionControl[] = [];
    rows: (DevityCertificateData & { id: string })[] = [];

    constructor(
        private keynoaService: KeynoaService,
        private proxyService: DevityProxyService, 
        private caActionService: CertificateAuhtorityActionService
    ) {}

    async load() {
        const caID = this.keynoaService.getCAId();
        const cas = await this.proxyService.getCertificateAuthorities();
        const ourCA = cas.find(ca => ca.caId === caID);
        if (ourCA) {
            const issuingCA = await this.proxyService.getIssuingCA(caID);
            console.log(issuingCA.caCertificateId);
        }
        this.rows = [{ ...ourCA, id: caID.toString()}];
    }

    onDownloadCert(cert: DevityCertificateData): void {
        let blob = new Blob([cert.certificate], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `${cert.subjectCn}.pem`);
    }
}