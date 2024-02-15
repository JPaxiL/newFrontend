import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixTimeToDate'
})
export class UnixTimeToDatePipe implements PipeTransform {

  transform(value: number): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleTimeString();
  }

}
