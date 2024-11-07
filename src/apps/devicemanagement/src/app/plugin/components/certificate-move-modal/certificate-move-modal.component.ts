import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  ConfirmModalComponent,
  CoreModule,
  FormsModule,
  ModalLabels,
  ModalModule,
  Status,
  StatusType
} from '@c8y/ngx-components';
import { Subject } from 'rxjs';
import { ThinEdgeConfiguration } from '~models/rest-reponse.model';

@Component({
  selector: 'tut-delete-modal',
  template: ` <c8y-confirm-modal
    [title]="'Move device'"
    [status]="status"
    [labels]="labels"
    #modalRef
  >
    <form>
      <p class="text-wrap m-b-16">
        {{ 'You are about to move the device to another tenant. Do you want to proceed?' }}
      </p>
      <c8y-form-group class="m-b-0">
        <label class="c8y-checkbox" title="{{ 'Move devices to another tenant' }}"></label>
        <div class="c8y-select-wrapper">
          <select
              [(ngModel)]="selectedConfig"
              class="btn btn-default dropdown-toggle c8y-dropdown w2a-select"
            >
            <option value="" selected disabled>Select a configuration…</option>
            <option *ngFor="let c of configs" [ngValue]="c">
              {{ c.id }} ({{ c.cumulocityConfiguration?.c8yUrl }})
            </option>
          </select>
        </div>
      </c8y-form-group>
    </form>
  </c8y-confirm-modal>`,
  standalone: true,
  imports: [ModalModule, FormsModule, CoreModule]
})
export class CertificateMoveModalComponent implements AfterViewInit {
  @ViewChild('modalRef', { static: false }) modalRef: ConfirmModalComponent;
  labels: ModalLabels = { ok: 'Move', cancel: 'Cancel' };
  status: StatusType = Status.WARNING;
  closeSubject: Subject<ThinEdgeConfiguration | undefined> = new Subject();
  @Input() configs: ThinEdgeConfiguration[];
  @Input() set selectedConfigId(value: number) {
    if (value && this.configs?.length) {
      this.selectedConfig = this.configs.find(c => c.id === value);
    }
  };
  selectedConfig?: ThinEdgeConfiguration;

  @Output() hideModal = new EventEmitter();
    

  async ngAfterViewInit() {
    try {
      await this.modalRef.result;
      this.onClose();
    } catch (error) {
      this.onDismiss();
    }
  }

  onClose() {
    this.closeSubject.next(this.selectedConfig);
    this.hideModal.emit();
  }

  onDismiss() {
    // eslint-disable-next-line no-console
    console.log('You have clicked "Cancel" button the modal!');
    this.hideModal.emit();
  }
}
