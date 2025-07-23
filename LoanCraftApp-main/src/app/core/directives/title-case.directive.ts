import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTitleCase]',
  standalone: true
})

export class TitleCaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    const caretPosition = input.selectionStart;

    const originalValue = input.value;
    const transformedValue = this.toTitleCase(originalValue);

    if (originalValue !== transformedValue) {
      input.value = transformedValue;
      // Manually dispatch input event to update Angular form model
      input.setSelectionRange(caretPosition, caretPosition);
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
    }
  }

  private toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word =>
        word.length > 0
          ? word[0].toUpperCase() + word.slice(1)
          : ''
      )
      .join(' ');
  }
}

