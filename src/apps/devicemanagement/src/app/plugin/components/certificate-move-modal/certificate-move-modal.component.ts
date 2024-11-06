import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
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
         <input name="url" type="url" class="form-control" [(ngModel)]="config.url" placeholder="https://your-tenant.cumulocity.com" required/>
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
  closeSubject: Subject<string | undefined> = new Subject();
  config = {
    url: ''
  };

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
    this.closeSubject.next(this.config.url);
    this.hideModal.emit();
  }

  onDismiss() {
    // eslint-disable-next-line no-console
    console.log('You have clicked "Cancel" button the modal!');
    this.hideModal.emit();
  }
}
