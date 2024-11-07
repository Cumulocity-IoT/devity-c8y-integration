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
  csr: string | null;
  certificate: string;
  fingerprint: string;
  issuerCaFingerprint: string;
  caId: number;
  caName: string;
  pkiPath: string;
  algorithm: string;
  issuerCn: string;
  subjectCn: string;
  subOrganization: string;
  /** ISO 8601 format timestamp */
  expirationTime: string;
  defaultCertificateTemplateId: number;
  protected: boolean;
  isEnterprise: boolean;
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
