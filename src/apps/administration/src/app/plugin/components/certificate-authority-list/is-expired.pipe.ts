import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isFutureDate'
})
export class IsFutureDatePipe implements PipeTransform {

  transform(dateString: string): boolean {
    // Parse the input date string to a Date object
    const inputDate = new Date(dateString);
    // Get the current date and time
    const now = new Date();

    // Compare the input date with the current date
    return inputDate > now;
  }
}