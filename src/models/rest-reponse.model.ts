export interface DevityDevice {
  guid: string;
  devName: string;
  devModel: string;
  status: 'waiting' | 'active' | 'completed' | string; // Use literal types if there are specific values
  to0Status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | string; // Update with actual possible values
  failedTo0Reason: string;
  failedTo2Reason: string | null;
  serialNumber: string;
  lastProvisioningTime: string; // Can use `Date` if you prefer date objects
  lastUpdate: string; // Can use `Date` if you prefer date objects
  assignedIssuerId: string | null;
  claimingStatus: 'not_assigned' | 'assigned' | 'in_progress' | string; // Update with actual values
  claimingExpiryDate: string | null; // Can use `Date` if you prefer date objects
  replacedByDeviceSerial: string | null;
  replacedAt: string | null; // Can use `Date` if you prefer date objects
  allowDeviceReplacement: boolean;
}

export interface DevityDeviceCertificate {
  deviceGuid: string;
  appInstanceId: string;
  certificateSerialNumber: string;
  caFingerprint: string;
  /** Timestamp in milliseconds */
  issuedAt: number;
  /** Timestamp in milliseconds */
  expiredAt: number;
  /** Timestamp in milliseconds, nullable */
  revokedAt: number | null;
  // calculated status (valid/revoked/expired)
  status?: DevityCertificateStatus;
}

export interface DevityDeviceApp {
  deviceGuid: string;
  appInstanceId: string;
  configType: string;
  localConfigId: number;
}

export interface CumulocityConfiguration {
  id: number;
  c8yUrl: string;
  caId: number;
  cloudCaFingerprintPrimary: string;
  cloudCaFingerprintSecondary?: string | null;
}
export interface ThinEdgeConfiguration {
  id: number;
  cumulocityConfigurationId: number;
  templateName: string;
  certificateTemplateId: number;
  deviceSelector?: any | null;
  cumulocityConfiguration?: CumulocityConfiguration | null;
}

export interface CaCertificateDto {
  caCertificateId: number;
  certificate: string;
  fingerprint: string;
  issuerCaFingerprint: string | null;
  algorithm: string;
  issuerCn: string;
  subjectCn: string;
  subOrganization: string | null;
  expirationTime: string;
}

export interface TrustAnchorCertificate {
  caCertificateId: number;
  certificate: string;
  fingerprint: string;
  issuerCaFingerprint: string | null;
  algorithm: string;
  issuerCn: string;
  subjectCn: string;
  subOrganization: string;
  expirationTime: string;
  crlDistributionUrl: string | null;
}

export interface DevityCertificateData {
  acmeDirectory: string;
  algorithm: string;
  caId: number;
  caName: string;
  certificate: string;
  csr: string | null;
  defaultCertificateTemplateId: number;
  expirationTime: string; // ISO 8601 format timestamp
  fingerprint: string;
  isEnterprise: boolean;
  issuerCaFingerprint: string;
  issuerCn: string;
  pkiPath: string;
  protected: boolean;
  subjectCn: string;
  subOrganization: string;
}

export interface IssuingCA {
  id: number;
  caName: string;
  caCertificateId: number;
  protected: boolean;
  internal: boolean;
  pkiPath: string;
  defaultCertificateTemplateId: number;
  hidden: boolean;
  acmeDirectory: string;
}

export const DevityCertificateStatus = {
  VALID: 'valid',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
  UNKNOWN: 'unknown',
};
export type DevityCertificateStatus =
  (typeof DevityCertificateStatus)[keyof typeof DevityCertificateStatus];

export interface CertificateAuthorityConfig {
  caType: string; // e.g., "INTERNAL"
  rootTTl: string; // e.g., "87600h"
  intermediateTTL: string; // e.g., "43800h"
  keyType: string; // e.g., "RSA"
  keyBits: number; // e.g., 4096
  csrFields: CSRFields;
  defaultCertificateTemplate: CertificateTemplate;
}

export interface CSRFields {
  altNames: string; // e.g., "example.com"
  ipSans: string; // e.g., "192.168.0.1"
  uriSans: string; // e.g., "string"
  otherSans: string; // e.g., "<oid>;<type>:<value>"
  ou: string; // e.g., "Research & Development"
  organization: string; // e.g., "DEVITY"
  country: string; // e.g., "DE"
  locality: string; // e.g., "Paderborn"
  province: string; // e.g., "NRW"
  streetAddress: string; // e.g., "31 Samplestraße"
  postalCode: string; // e.g., "34000"
}

export interface CertificateTemplate {
  id: number; // e.g., 0
  distinguishedName: {
    commonName: string | null;
    country: string | null;
    organization: string | null;
    organizationUnit: string | null;
    stateOrProvince: string | null;
    serialNumber: string | null;
    locality: string | null;
  } | null;
  subjectAltName: {
    dnsName: string | null;
    uri: string | null;
    includeDeviceIp: boolean | null;
  } | null;
  keyUsage: {
    digitalSignature: boolean;
    keyEncipherment: boolean;
    dataEncipherment: boolean;
    keyAgreement: boolean;
    keyCertSign: boolean;
    crlSign: boolean;
  };
  extendedKeyUsage: {
    clientAuth: boolean;
    codeSigning: boolean;
    serverAuth: boolean;
    emailProtection: boolean;
    timeStamping: boolean;
    ocspSigning: boolean;
  };
  validityPeriod: string; // e.g., "720h"
  renewBefore: number; // e.g., 20
  keyAlgorithm: string; // e.g., "RSA3072"
  signAlgorithm: string; // e.g., "SHA256"
}

export interface CertificateAuthorityCreate {
  caName: string;
  certificate: string;
  csr: string | null;
  pkiPath: string;
}
