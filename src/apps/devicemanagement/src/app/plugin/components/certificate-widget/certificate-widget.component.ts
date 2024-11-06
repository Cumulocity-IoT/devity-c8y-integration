import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IManagedObject } from "@c8y/client";

@Component({
    templateUrl: './certificate-widget.component.html'
})
export class CertificateWidgetComponent {
    device: IManagedObject;
    cert = {
        application: 'Foo',
        serialNumber: 'bar',
        authority: 'jens',
        issueDate: new Date().toISOString(),
        expirationDate: new Date().toISOString(),
        isActive: true
    };

    constructor(route: ActivatedRoute) {
        this.device = route.snapshot.parent?.data["contextData"];
    }

}