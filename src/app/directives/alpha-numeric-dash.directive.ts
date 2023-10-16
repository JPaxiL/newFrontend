import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphaNumericDash]'
})
export class AlphaNumericDashDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any): void {
    const initialValue = this.el.nativeElement.value;
    const sanitizedValue = initialValue.replace(/[^a-zA-Z0-9-]/g, '');
    if (initialValue !== sanitizedValue) {
      event.preventDefault();
      this.el.nativeElement.value = sanitizedValue;
    }
  }
}
