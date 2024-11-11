import { FormlyFieldConfig } from '@ngx-formly/core';

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

export const Step3FormlyFieldConfig: FormlyFieldConfig[] = [
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
];