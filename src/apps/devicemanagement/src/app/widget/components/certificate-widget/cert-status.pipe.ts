import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'certIcon',
  standalone: false
})
export class CertificateIconPipe implements PipeTransform {

  transform(cert?: { 
    application: string,
    serialNumber: string,
    authority: string,
    issueDate: string,
    expirationDate: string,
    isActive: boolean,
    isRevoked: boolean, 
  }): string {
   if (!cert) {
    return 'unverified-account';
   }
   if (cert.isActive && !cert.isRevoked) {
    return 'approval';
   } else {
    if (cert.isRevoked) {
        return 'spam';
    } else {
        return 'exclamation-circle';
    }
   }
  }
}

@Pipe({
    name: 'certStatus',
    standalone: false
  })
  export class CertificateStatusPipe implements PipeTransform {
  
    transform(cert?: { 
      application: string,
      serialNumber: string,
      authority: string,
      issueDate: string,
      expirationDate: string,
      isActive: boolean,
      isRevoked: boolean, 
    }): string {
     if (!cert) {
      return 'No certificate found.';
     }
     if (cert.isActive && !cert.isRevoked) {
      return 'Active';
     } else {
      if (cert.isRevoked) {
          return 'Revoked';
      } else {
          return 'Expired';
      }
     }
    }
  }