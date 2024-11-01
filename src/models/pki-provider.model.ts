import { IManagedObject } from '@c8y/client';

export interface PKIProvider extends IManagedObject {
  url: string;
  clientID: string;
  clientSecret: string;
}
