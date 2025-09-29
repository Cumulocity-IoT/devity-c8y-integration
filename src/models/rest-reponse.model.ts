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
// TODO: DevityDeviceCertificate has changed check demo
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

/**
 * data class DeviceCertificateDto(
    @Schema(
        description = "the ID of the leaf certificate",
        example = "1L",
    )
    override val leafCertificateId: Long? = null,
    @Schema(
        description = "the serial number of the certificate for the application on device",
        example = "0A:81:9D:D8:C5:E5:99:0C:B7:AD:68:EA:87:B2:A5:67",
    )
    override val certificateSerialNumber: String,
    @Schema(
        description = "the SHA2-512 fingerprint of the CA, who issues the certificate for the application on device",
        example =
            "074a66319673cba1fd1ead3805d71197e1d3578fc4d4a090ccfa5168ce8c75705d1" +
                "fefc445959449f541aecb86937160bdcb5aff438e968cbda44be1ef32df54",
    )
    override val caFingerprint: String,
    @Schema(
        description = "the identifying guid for the device",
        example = "ece992be-5e56-4a64-9dd5-264c7927481f",
    )
    override val deviceGuid: String?,
    @Schema(
        description = "the identifier for the application instance",
        example = "mqtt1",
    )
    override val appInstanceId: String,
    @Schema(
        description = "the time, when the certificate for the application on device is issued",
        example = "2024-07-01 00:00:00",
    )
    override val issuedAt: Date,
    @Schema(
        description = "the time, when the certificate for the application on device is expired",
        example = "2025-10-01 00:00:00",
    )
    override val expiredAt: Date,
    @Schema(
        description = "the time, when the certificate for the application on device is revoked",
        example = "2024-08-01 00:00:00",
    )
    override val revokedAt: Date?,
    @Schema(
        description = "Subject CN",
        example = "test",
    )
    override val certName: String,
)
 */

export interface DevityDeviceApp {
  deviceGuid: string;
  appInstanceId: string;
  configType: string;
  localConfigId: number;
}

export interface CumulocityConfiguration {
  id: number;
  c8yUrl: string;
  issuingCaId: number;
  cloudCaFingerprintPrimary: string;
  cloudCaFingerprintSecondary?: string | null;
  useOsTrustAnchor: boolean;
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

export interface IssuingCA {
  id: number;
  caName: string;
  caCertificateId: number;
  protected: boolean;
  internal: boolean;
  pkiPath: string;
  defaultCertificateTemplateId: number;
  hidden: boolean;
  caCertificate?: CaCertificateDto;
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

export interface Permission {
  iamGroupId: string;
  resourceRoles: {
    resource: {
      id: string;
      entityId: string;
    };
    roles: Role[];
  }[];
}
export interface Role {
  roleId: string;
  roleName: string;
  description: string;
}
