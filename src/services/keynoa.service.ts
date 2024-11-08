import { Injectable } from '@angular/core';
import { FetchClient, IResult, InventoryService } from '@c8y/client';
import { has } from 'lodash';
import {
  KEYNOA_URL_AUTH,
  KEYNOA_URL_BASE,
  KEYNOA_URL_PATTERN,
} from '../models/keynoa.model';
import { PKIProvider, PKI_PROVIDER_TYPE } from '../models/pki-provider.model';

@Injectable({ providedIn: 'root' })
export class KeynoaService {
  
  constructor(
    private fetchClient: FetchClient,
    private inventoryService: InventoryService
  ) {}

  async connect(provider: PKIProvider): Promise<void> {
    // console.log('auth', { url, clientID, clientSecret }); // TODO when/how to send?
    const match = provider.url.match(KEYNOA_URL_PATTERN);

    if (!match || !match[1]) throw 'Not a KEYNOA url';

    this.fetchClient.fetch(this.getUrl(KEYNOA_URL_AUTH, { tenant: match[1] }));
  }

  async delete(id: PKIProvider['id']): Promise<PKIProvider> {
    return (await this.inventoryService.delete(id)).data;
  }

  async list(): Promise<PKIProvider[]> {
    return (
      await this.inventoryService.list({
        type: PKI_PROVIDER_TYPE,
        pageSize: 2000,
      })
    )?.data as PKIProvider[];
  }

   getProvider(id: string | number): Promise<PKIProvider> {
    return this.inventoryService.detail(id).then(res => res.data as PKIProvider);
  }

  async set(provider: Partial<PKIProvider>): Promise<PKIProvider> {
    let response: IResult<PKIProvider>;

    // type is missing when simply using admin form data
    provider = { ...provider, ...{ type: PKI_PROVIDER_TYPE } };

    if (has(provider, 'id') && !!provider.id) {
      response = (await this.inventoryService.update(
        provider
      )) as IResult<PKIProvider>;
    } else {
      response = (await this.inventoryService.create(
        provider
      )) as IResult<PKIProvider>;
    }

    if (has(response, 'data')) return response.data;
  }

  private getUrl(url: string, replacements?: object): string {
    return KEYNOA_URL_BASE + this.urlReplace(url, replacements);
  }

  // to be reused in other urls
  private urlReplace(url: string, replacements?: object): string {
    if (!replacements) return url;

    const keys = Object.keys(replacements);

    keys.forEach((key) => {
      url = url.replace(`{${key}}`, replacements[key]);
    });

    return url;
  }
}
