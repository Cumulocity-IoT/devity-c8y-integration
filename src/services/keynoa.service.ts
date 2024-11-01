import { Injectable } from '@angular/core';
import { FetchClient } from '@c8y/client';
import {
  KEYNOA_URL_AUTH,
  KEYNOA_URL_BASE,
  KEYNOA_URL_PATTERN,
} from '../models/keynoa.model';
import { PKIProvider } from '../models/pki-provider.model';

@Injectable({ providedIn: 'root' })
export class KeynoaService {
  constructor(private fetchClient: FetchClient) {}

  async auth(
    url: PKIProvider['url'],
    clientID: PKIProvider['clientID'],
    clientSecret: PKIProvider['clientSecret']
  ): Promise<void> {
    console.log('auth', { url, clientID, clientSecret });
    const match = url.match(KEYNOA_URL_PATTERN);

    console.log('auth', match);

    if (!match) throw 'Not a KEYNOA url';

    this.fetchClient.fetch(this.getUrl(KEYNOA_URL_AUTH, { tenant: match[1] }));
  }

  private getUrl(url: string, replacements?: object): string {
    return KEYNOA_URL_BASE + this.urlReplace(url, replacements);
  }

  private urlReplace(url: string, replacements?: object) {
    if (!replacements) return url;

    const keys = Object.keys(replacements);

    console.log('urlReplace', keys);
  }
}
