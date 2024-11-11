import { Injectable } from "@angular/core";
import { CertificateAuthorityConfig, CertificateTemplate } from "~models/rest-reponse.model";
import { CertificateAuthorityFormlyResult, CertificatePolicyFormlyResult } from "./formly-templates.model";
import moment from "moment";

@Injectable({
    providedIn: 'root'
})
export class FormlyHelperService {
    convertFormlyModelToPayload(model: CertificateAuthorityFormlyResult & CertificatePolicyFormlyResult): CertificateAuthorityConfig | undefined {
        const payload: CertificateAuthorityConfig = {
            caType: 'INTERNAL',
            rootTTl: this.toDuration(model.rootCaTTL, model.rootTimeUnit),
            intermediateTTL: this.toDuration(model.intermediateCaTTL, model.intermediateTimeUnit),
            ...this.parseAlgorithm(model.algorithm),
            csrFields: {
                altNames: '',
                ipSans: '',
                otherSans: '',
                uriSans: '',
                ou: model.organizationUnit,
                organization: model.organization,
                country: model.country,
                locality: model.locality,
                province: model.state,
                streetAddress: '',
                postalCode: '',
            },
            defaultCertificateTemplate: this.createDefaultCertificateTemplate(model)
        };
        
        return payload;
    }

    private createDefaultCertificateTemplate(model: CertificatePolicyFormlyResult): CertificateTemplate {
        const template: CertificateTemplate = {
            id: null,
            distinguishedName: {
                commonName: model.commonName,
                country: model.pCountry,
                organization: model.pOrganization,
                organizationUnit: model.pOrganizationUnit,
                stateOrProvince: model.pState,
                serialNumber: model.serialNumber,
                locality: model.pLocality
            },
            subjectAltName: {
                dnsName: model.dnsName || null,
                uri: model.uri || null,
                includeDeviceIp: model.includeDeviceIp,
            },
            keyUsage: this.parseKeyUsage(model.keyUsage),
            extendedKeyUsage: this.parseExtendedKeyUsage(model.extendedKeyUsage),
            keyAlgorithm: model.keyAlgorithm.replace('-', ''),
            signAlgorithm: model.signAlgorithm,
            validityPeriod: this.toDuration(model.certTTL, model.certTimeUnit),
            renewBefore: model.renewBefore,
        };
        return template;
    }

    private toDuration(value: number, unit: 'hours' | 'days' | 'months' | 'years') {
        const duration = moment.duration(value, unit);
        const totalHours = duration.asHours();
        return `${totalHours}h`;
    }

    private parseAlgorithm(algorithm: string): { keyType: string, keyBits: number } {
        const [keyType, keySize] = algorithm.split('-');
        if (keyType && keySize) {
          return {
            keyType: keyType.toLowerCase(),
            keyBits: parseInt(keySize)
          };
        }
        throw new Error('Could not parse ' + algorithm);
    }

    private parseKeyUsage(selected?: Array<'digitalSignature' | 'keyEncipherment' | 'dataEncipherment' | 'keyAgreement' | 'keyCertSign' | 'crlSign'>) {
        const keyUsage = {
            digitalSignature: false, 
            keyEncipherment: false, 
            dataEncipherment: false,
            keyAgreement: false,
            keyCertSign: false, 
            crlSign: false };
        if (!selected?.length) {
            return keyUsage;
        }
        Object.keys(keyUsage).forEach((key) => {
            const attrName = key as 'digitalSignature' | 'keyEncipherment' | 'dataEncipherment' | 'keyAgreement' | 'keyCertSign' | 'crlSign';
            if (selected.includes(attrName)) {
                keyUsage[attrName] = true;
            }
        });
        return keyUsage;
    }

    private parseExtendedKeyUsage(selected: Array<'clientAuth' | 'codeSigning' | 'serverAuth' | 'emailProtection' | 'timeStamping' | 'ocspSigning'>) {
        const extendedKeyUsage = { clientAuth: false, codeSigning: false, serverAuth: false, emailProtection: false, timeStamping: false , ocspSigning: false };
        if (!selected?.length) {
            return extendedKeyUsage;
        }
        Object.keys(extendedKeyUsage).forEach((key) => {
            const attrName = key as 'clientAuth' | 'codeSigning' | 'serverAuth' | 'emailProtection' | 'timeStamping' | 'ocspSigning';
            if (selected.includes(attrName)) {
                extendedKeyUsage[attrName] = true;
            }
        });
        return extendedKeyUsage;
    }
}