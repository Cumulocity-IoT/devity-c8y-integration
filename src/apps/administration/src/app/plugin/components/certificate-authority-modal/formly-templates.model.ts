import { FormlyFieldConfig } from '@ngx-formly/core';

export interface CertificateAuthorityFormlyResult {
    organization?: string;
    organizationUnit?: string;
    intermediateCaTTL: number;
    intermediateTimeUnit: 'hours' | 'days' | 'months' | 'years';
    algorithm: 'RSA-3072' | 'RSA-4096' | 'EC-256' | 'EC-384' | 'EC-521';
    locality?: string;
    state?: string;
    country?: string;
    rootCaTTL: number;
    rootTimeUnit: 'hours' | 'days' | 'months' | 'years';
  }
  

export const Step2FormlyFieldConfig: FormlyFieldConfig[] = [
  {
    fieldGroupClassName: 'd-flex',
    fieldGroup: [
      {
        className: 'col-md-6 p-l-0',
        key: 'organization',
        type: 'input',
        defaultValue: 'DEVITY',
        templateOptions: {
          label: 'Organization',
          description: 'Organization Name',
          placeholder: 'Enter organization name',
        },
      },
      {
        className: 'col-md-6 p-r-0',
        key: 'organizationUnit',
        type: 'input',
        defaultValue: 'KEYNOA',
        templateOptions: {
          label: 'Organization Unit',
          description: 'Specify the organization unit',
          placeholder: 'Enter organization unit',
        },
      },
    ],
  },
  {
    fieldGroupClassName: 'd-flex',
    fieldGroup: [
      {
        className: 'col-md-6 p-l-0',
        key: 'intermediateCaTTL',
        type: 'input',
        defaultValue: 2,
        templateOptions: {
          label: 'Intermediate CA TTL',
          description: 'The time-to-live (TTL) for the Intermediate Certificate Authority.',
          type: 'number',
          placeholder: 'Enter TTL in hours',
          required: true,
        },
      },
      {
        className: 'col-md-6 p-r-0',
        key: 'intermediateTimeUnit',
        type: 'select',
        defaultValue: 'hours',
        templateOptions: {
          label: 'Time Unit',
          description: 'Specify the unit of time for the TTL.',
          options: [
            { value: 'hours', label: 'Hours' },
            { value: 'days', label: 'Days' },
            { value: 'months', label: 'Months' },
            { value: 'years', label: 'Years' },
          ],
          required: true,
        },
      },
    ],
  },
  {
    key: 'algorithm',
    type: 'select',
    defaultValue: 'RSA-4096',
    templateOptions: {
      label: 'Algorithm',
      description: 'The cryptographic algorithm to use.',
      options: [
        { value: 'RSA-3072', label: 'RSA-3072' },
        { value: 'RSA-4096', label: 'RSA-4096' },
        { value: 'EC-256', label: 'EC-256' },
        { value: 'EC-384', label: 'EC-384' },
        { value: 'EC-521', label: 'EC-521' },
      ],
      required: true,
    },
  },
  {
    fieldGroupClassName: 'd-flex',
    fieldGroup: [
      {
        className: 'col-md-4 p-l-0',
            key: 'locality',
            type: 'input',
            defaultValue: 'Nürnberg',
            templateOptions: {
              label: 'Locality',
              placeholder: 'Enter locality',
            }
      },
      {
        key: 'state',
        className: 'col-md-4 p-l-0',
            type: 'input',
            defaultValue: 'BY',
            templateOptions: {
              label: 'State',
              placeholder: 'Enter state',
            },
      },
      {
        key: 'country',
        className: 'col-md-4 p-r-0',
        type: 'input',
        defaultValue: 'DE',
        templateOptions: {
            label: 'Country',
            placeholder: 'Enter country code',
        },
    },
    ]
    },
    {
        fieldGroupClassName: 'd-flex',
        fieldGroup: [
          {
            className: 'col-md-6 p-l-0',
            key: 'rootCaTTL',
            type: 'input',
            defaultValue: 2,
            templateOptions: {
              label: 'Root CA TTL',
              description: 'The time-to-live (TTL) for the Root Certificate Authority.',
              type: 'number',
              placeholder: 'Enter TTL number, select the unit',
              required: true,
            },
          },
          {
            className: 'col-md-6 p-r-0',
            key: 'rootTimeUnit',
            type: 'select',
            defaultValue: 'Hours',
            templateOptions: {
              label: 'Time Unit',
              description: 'Specify the unit of time for the TTL.',
              options: [
                { value: 'Hours', label: 'Hours' },
                { value: 'Days', label: 'Days' },
                { value: 'Months', label: 'Months' },
                { value: 'Years', label: 'Years' },
              ],
              required: true,
            },
          },
        ],
      },
  
];

export interface CertificatePolicyFormlyResult {
    pOrganization?: string;
    pOrganizationUnit?: string;
    pLocality?: string;
    pState?: string;
    pCountry?: string;
    serialNumber?: string;
    commonName: string;
    includeDeviceIp?: boolean;
    certTTL: number;
    certTimeUnit: 'hours' | 'days' | 'months' | 'years';
    renewBefore: number;
    renewBeforeTimeUnit: 'Hours' | 'Days' | 'Months' | 'Years';
    keyAlgorithm: 'RSA-3072' | 'RSA-4096' | 'EC-256' | 'EC-384' | 'EC-521'; // Adjust as necessary
    signAlgorithm: 'SHA256' | 'SHA384' | 'SHA512';
    extendedKeyUsage?: Array<'clientAuth' | 'codeSigning' | 'serverAuth' | 'emailProtection' | 'timeStamping' | 'ocspSigning'>;
    keyUsage?: Array<'digitalSignature' | 'keyEncipherment' | 'dataEncipherment' | 'keyAgreement' | 'keyCertSign' | 'crlSign'>;
    dnsName?: string;
    uri?: string;
  }

export const Step3FormlyFieldConfig: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'd-flex',
        fieldGroup: [
          {
            className: 'col-md-6 p-l-0',
            key: 'pOrganization',
            type: 'input',
            defaultValue: 'DEVITY',
            templateOptions: {
              label: 'Organization',
              description: 'Organization Name',
              placeholder: 'Enter organization name',
            },
          },
          {
            className: 'col-md-6 p-r-0',
            key: 'pOrganizationUnit',
            type: 'input',
            defaultValue: 'KEYNOA',
            templateOptions: {
              label: 'Organization Unit',
              description: 'Specify the organization unit',
              placeholder: 'Enter organization unit',
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'd-flex',
        fieldGroup: [
          {
            className: 'col-md-4 p-l-0',
                key: 'pLocality',
                type: 'input',
                defaultValue: 'Nürnberg',
                templateOptions: {
                  label: 'Locality',
                  placeholder: 'Enter locality',
                }
          },
          {
            key: 'pState',
            className: 'col-md-4 p-l-0',
                type: 'input',
                defaultValue: 'BY',
                templateOptions: {
                  label: 'State',
                  placeholder: 'Enter state',
                },
          },
          {
            key: 'pCountry',
            className: 'col-md-4 p-r-0',
            type: 'input',
            defaultValue: 'DE',
            templateOptions: {
                label: 'Country',
                placeholder: 'Enter country code',
            },
        },
        ]
        },
      {
        fieldGroupClassName: 'd-flex',
        fieldGroup: [
          {
            className: 'col-md-6 p-l-0',
            key: 'serialNumber',
            type: 'input',
            defaultValue: '$(serial)',
            templateOptions: {
                label: 'Serial Number',
                description: 'Input field supports template string.',
            },
          },
          {
            className: 'col-md-6 p-r-0',
            key: 'commonName',
            type: 'input',
            defaultValue: '$(serial)',
            templateOptions: {
                label: 'Common Name',
                description: 'Input field supports template string.',
                required: true,
            },
          },
        ]
    },
    {
        fieldGroupClassName: 'd-flex',
        fieldGroup: [
            {
                className: 'col-md-6 p-l-0',
                key: 'dnsName',
                type: 'input',
                templateOptions: {
                    label: 'SAN DNS',
                    description: 'Input field supports template string.',
                },
              },
          {
            className: 'col-md-6 p-r-0',
            key: 'uri',
            type: 'input',
            templateOptions: {
                label: 'SAN URI',
                description: 'Input field supports template string.',
            },
          },
        ]
    },
    {
        key: 'includeDeviceIp',
        type: 'select',
        defaultValue: false,
        templateOptions: {
          label: 'Include Device Ip',
          options: [
            { value: false, label: 'false' },
            { value: true, label: 'true' },
          ],
          required: true,
        },
      },
      {
        fieldGroupClassName: 'd-flex',
        fieldGroup: [
          {
            className: 'col-md-6 p-l-0',
            key: 'certTTL',
            type: 'input',
            defaultValue: 2,
            templateOptions: {
              label: 'Certificate TTL',
              description: 'The time-to-live (TTL) for the Certificate.',
              type: 'number',
              placeholder: 'Enter TTL number, select the unit',
              required: true,
            },
          },
          {
            className: 'col-md-6 p-r-0',
            key: 'certTimeUnit',
            type: 'select',
            defaultValue: 'hours',
            templateOptions: {
              label: 'Time Unit',
              description: 'Specify the unit of time for the TTL.',
              options: [
                { value: 'hours', label: 'Hours' },
                { value: 'days', label: 'Days' },
                { value: 'months', label: 'Months' },
                { value: 'years', label: 'Years' },
              ],
              required: true,
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'd-flex',
        fieldGroup: [
          {
            className: 'col-md-6 p-l-0',
            key: 'renewBefore',
            type: 'input',
            defaultValue: 20,
            templateOptions: {
              label: 'Renew Before',
              type: 'number',
              required: true,
            },
          },
          {
            className: 'col-md-6 p-r-0',
            key: 'renewBeforeTimeUnit',
            type: 'select',
            defaultValue: 'days',
            templateOptions: {
              label: 'Time Unit',
              options: [
                { value: 'hours', label: 'Hours' },
                { value: 'days', label: 'Days' },
                { value: 'months', label: 'Months' },
                { value: 'years', label: 'Years' },
              ],
              required: true,
            },
          },
        ],
      },
      {
        fieldGroupClassName: 'd-flex',
        fieldGroup: [
            {
                className: 'col-md-6 p-l-0',
                key: 'keyAlgorithm',
                type: 'select',
                defaultValue: 'RSA-4096',
                templateOptions: {
                  label: 'Key Algorithm',
                  description: 'The cryptographic algorithm to use.',
                  options: [
                    { value: 'RSA-3072', label: 'RSA-3072' },
                    { value: 'RSA-4096', label: 'RSA-4096' },
                    { value: 'EC-256', label: 'EC-256' },
                    { value: 'EC-384', label: 'EC-384' },
                    { value: 'EC-521', label: 'EC-521' },
                  ],
                  required: true,
                },
              },
              {
                className: 'col-md-6 p-r-0',
                key: 'signAlgorithm',
                type: 'select',
                defaultValue: 'SHA256',
                templateOptions: {
                  label: 'Signature Algorithm',
                  description: 'The signature algorithm to use.',
                  options: [
                    { value: 'SHA256', label: 'SHA256' },
                    { value: 'SHA384', label: 'SHA384' },
                    { value: 'SHA512', label: 'SHA512' },
                  ],
                  required: true,
                },
              },
        ]
      },
      {
        fieldGroupClassName: 'd-flex',
        fieldGroup: [
            {
                className: 'col-md-6 p-l-0',
                key: 'extendedKeyUsage',
                type: 'multi-select',
                templateOptions: {
                  label: 'Extended Key Usage ',
                  multiple: true,
                  options: [
                    { value: 'serverAuth', label: 'Server Auth' },
                    { value: 'clientAuth', label: 'Client Auth' },
                    { value: 'codeSigning', label: 'Code Signing' },
                    { value: 'emailProtection', label: 'Email Protection' },
                    { value: 'timeStamping', label: 'Time Stamping' },
                    { value: 'ocspSigning', label: 'OCSP Signing' },
                  ],
                },
              },
              {
                className: 'col-md-6 p-r-0',
                key: 'keyUsage',
                type: 'multi-select',
                templateOptions: {
                  label: 'Key Usage',
                  multiple: true,
                  options: [
                    { value: 'digitalSignature', label: 'Digital Signature' },
                    { value: 'nonRepudiation', label: 'Non-repudiation' },
                    { value: 'keyEncipherment', label: 'Key Encipherment' },
                    { value: 'dataEncipherment', label: 'Data Encipherment' },
                    { value: 'keyAgreement', label: 'Key Agreement' },
                    { value: 'keyCertSign', label: 'Key CertSign' },
                    { value: 'crlSign', label: 'Crl Sign' },
                    { value: 'encipherOnly', label: 'Encipher only' },
                    { value: 'decipherOnly', label: 'Decipher only' },
                  ],
                },
              },
        ],
      }      
];