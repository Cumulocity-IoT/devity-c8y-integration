import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'devity-certificate-authority-list',
  templateUrl: './certificate-authority-list.component.html',
})
export class DevityCertificateAuthorityListComponent implements OnInit {
  @Input() id: string | number;

  constructor() {
    console.log('DevityCertificateAuthorityListComponent');
  }

  ngOnInit() {
  }
}
