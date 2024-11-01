import { Injectable } from '@angular/core';
import { EventService, InventoryService } from '@c8y/client';
import { filter, orderBy } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { RELEASE_NOTES_EVENT_TYPE, RELEASE_NOTES_USER_LAST_READ_STORAGE } from '../models/release-notes.const';
import {
  CreateReleaseNoteObject,
  ReleaseNoteEvent,
} from '../models/release-notes.model';

@Injectable({ providedIn: 'root' })
export class ReleaseNotesService {
  releaseNoteUpdated$: Observable<void>;

  private sourceId: string = null;

  private _releaseNoteUpdated$ = new Subject<void>();

  constructor(
    private eventService: EventService,
    private inventoryService: InventoryService
  ) {
    this.releaseNoteUpdated$ = this._releaseNoteUpdated$.asObservable();
  }

  async init(): Promise<string> {
    // needed for release notes events to attach to source
    this.sourceId = await this.getGlobalSourceId();
    if (!this.sourceId) this.sourceId = await this.createGlobalSourceId();

    return this.sourceId;
  }

  async loadReleaseNotes(): Promise<ReleaseNoteEvent[]> {
    const res = await this.eventService.list({
      type: RELEASE_NOTES_EVENT_TYPE,
      pageSize: 2000,
    });

    return orderBy(
      res.data as ReleaseNoteEvent[],
      (event) => event[RELEASE_NOTES_EVENT_TYPE].publicationTime || '',
      'desc'
    );
  }

  async loadPublishedReleaseNotes(): Promise<ReleaseNoteEvent[]> {
    const res = await this.eventService.list({
      type: RELEASE_NOTES_EVENT_TYPE,
      pageSize: 2000,
    });

    return orderBy(
      filter(
        res.data as ReleaseNoteEvent[],
        (event) => event[RELEASE_NOTES_EVENT_TYPE].published
      ),
      (event) => event[RELEASE_NOTES_EVENT_TYPE].publicationTime || '',
      'desc'
    );
  }

  async create(
    releaseNote: CreateReleaseNoteObject
  ): Promise<ReleaseNoteEvent> {
    const res = await this.eventService.create({
      source: {
        id: this.sourceId,
      },
      text: releaseNote.title,
      type: RELEASE_NOTES_EVENT_TYPE,
      time: new Date().toISOString(),
      [RELEASE_NOTES_EVENT_TYPE]: {
        content: releaseNote.content,
        version: releaseNote.version,
        published: releaseNote.published,
        publicationTime: new Date().toISOString(),
      },
    });

    this._releaseNoteUpdated$.next();

    return res.data as ReleaseNoteEvent;
  }

  async update(
    releaseNote: CreateReleaseNoteObject
  ): Promise<ReleaseNoteEvent> {
    const release: Partial<ReleaseNoteEvent> = {
      content: releaseNote.content,
      version: releaseNote.version,
      published: releaseNote.published,
      publicationTime: releaseNote.publicationTime,
    };

    if (releaseNote.published && !releaseNote.publicationTime)
      release.publicationTime = new Date().toISOString();
    else if (!releaseNote.published) release.publicationTime = null;

    const res = await this.eventService.update({
      id: releaseNote.id,
      text: releaseNote.title,
      [RELEASE_NOTES_EVENT_TYPE]: release,
    });

    this._releaseNoteUpdated$.next();

    return res.data as ReleaseNoteEvent;
  }

  async delete(id: ReleaseNoteEvent['id']): Promise<void> {
    await this.eventService.delete(id);

    this._releaseNoteUpdated$.next();
  }

  private async getGlobalSourceId(): Promise<string> {
    try {
      const res = await this.inventoryService.list({
        type: RELEASE_NOTES_EVENT_TYPE,
      });

      const asset = res.data?.shift();

      return !!asset ? asset.id : null;
    } catch (error) {
      console.error('[RN.S:1] Could not fetch global source', error);
    }
  }

  private async createGlobalSourceId(): Promise<string> {
    try {
      const res = await this.inventoryService.create({
        type: RELEASE_NOTES_EVENT_TYPE,
      });

      return res.data.id;
    } catch (error) {
      console.error('[RN.S:2] Could not create global source', error);
    }
  }

  setUserLastRead() {
    localStorage.setItem(RELEASE_NOTES_USER_LAST_READ_STORAGE, new Date().toISOString());
  }

  getUserLastRead(): string {
    return localStorage.getItem(RELEASE_NOTES_USER_LAST_READ_STORAGE);
  }
}
