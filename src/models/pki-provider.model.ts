import { IManagedObject } from '@c8y/client';

export const PKI_PROVIDER_TYPE = 'c8y_PKIProvider';

export interface PKIProvider extends IManagedObject {
  url: string;
  clientID: string;
  clientSecret: string;
  caName?: string;
  caType?: string;
  caIds?: number[];
}
