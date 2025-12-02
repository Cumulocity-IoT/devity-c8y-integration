import { IManagedObject } from '@c8y/client';

export const PKI_PROVIDER_TYPE = 'c8y_PKIProvider';

export interface PKIProvider extends IManagedObject {
  url: string;
  clientID: string;
  clientSecret: string;
  caId?: number;
  c8yConfigId?: number;
  certTemplateId?: number;
  thinEdgeConfigId?: number;
  thinEdgeName?: string;
}
