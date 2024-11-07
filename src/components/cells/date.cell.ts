import { Component } from '@angular/core';
import { CellRendererContext, CommonModule } from '@c8y/ngx-components';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MomentModule } from 'ngx-moment';

@Component({
  standalone: true,
  template:
    '<span [tooltip]="context.value | amTimeAgo" container="body">{{ context.value | c8yDate }}</span>',
  imports: [CommonModule, MomentModule, TooltipModule],
})
export class DateCellRendererComponent {
  constructor(public context: CellRendererContext) {}
}
