import { Component, Input } from '@angular/core';
import { ErrorCause } from '@models';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
})
export class ErrorComponent {
  @Input() cause: ErrorCause | null = null;

  get text(): string {
    switch (this.cause) {
      case ErrorCause.UnknownId:
        return 'Neznámý druh občerstvení';
      case ErrorCause.NotEnoughStocks:
        return 'Bohužel nemáme na skladě dostatek k uspokojení vaší objednávky';
      case ErrorCause.Offline:
        return 'Nejste připojeni k internetu';
      default:
        return 'Stalo se něco nepěkného';
    }
  }
}
