import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ErrorCause } from '@models';

import { StoreService } from 'src/app/store.service';
import { GetTypes, GetQuantity, selectors, PutOrder, Clear, ToggleNotifications } from 'src/app/ducks/refreshments';

interface RefreshmentTypeSanitized {
  id: number;
  name: string;
  icon: SafeHtml;
}

@Component({
  selector: 'app-refreshments',
  templateUrl: './refreshments.component.html',
  styleUrls: ['./refreshments.component.scss']
})
export class RefreshmentsComponent implements OnInit, OnDestroy {
  loadingTypes!: Observable<boolean>;
  refreshmentTypes!: Observable<RefreshmentTypeSanitized[]>;
  typesError!: Observable<ErrorCause | null>;

  selectedType!: Observable<number | null>;

  loadingQuantity!: Observable<boolean>;
  quantity!: Observable<number | null>;
  quantityError!: Observable<ErrorCause | null>;

  puttingOrder!: Observable<boolean>;
  delivering!: Observable<boolean>;
  orderError!: Observable<ErrorCause | null>;

  notificationsAllowed!: Observable<boolean>;
  togglingNotifications!: Observable<boolean>;

  desiredQuantity = 1;

  constructor(private storeService: StoreService, private sanitizer: DomSanitizer) { }

  get validQuantity(): boolean {
    let available!: number | null;
    this.quantity.pipe(
      take(1),
    ).subscribe(q => available = q);
    return Number.isInteger(this.desiredQuantity) && this.desiredQuantity >= 1 && this.desiredQuantity <= (available || 0);
  }

  ngOnInit(): void {
    this.storeService.dispatch(new GetTypes());

    this.loadingTypes = this.storeService.select(selectors.isLoadingTypes);
    this.refreshmentTypes = this.storeService.select(selectors.selectTypes).pipe(
      map(types => types.map(t => ({ ...t, icon: this.sanitizer.bypassSecurityTrustHtml(t.icon) }))),
    );
    this.typesError = this.storeService.select(selectors.selectTypesError);

    this.selectedType = this.storeService.select(selectors.selectSelectedType);

    this.loadingQuantity = this.storeService.select(selectors.isLoadingQuantity);
    this.quantity = this.storeService.select(selectors.selectQuantity);
    this.quantityError = this.storeService.select(selectors.selectQuantityError);

    this.puttingOrder = this.storeService.select(selectors.isPuttingOrder);
    this.delivering = this.storeService.select(selectors.isDelivering);
    this.orderError = this.storeService.select(selectors.selectOrderError);

    this.notificationsAllowed = this.storeService.select(selectors.areNotificationsAllowed);
    this.togglingNotifications = this.storeService.select(selectors.isTogglingNotifications);
  }

  ngOnDestroy(): void {
    this.storeService.dispatch(new Clear());
  }

  onSelectType(id: number): void {
    this.storeService.dispatch(new GetQuantity(id));
    this.desiredQuantity = 1;
  }

  onOrder(): void {
    this.storeService.dispatch(new PutOrder(this.desiredQuantity));
  }

  onClear(): void {
    this.storeService.dispatch(new Clear());
  }

  onToggleNotifications(): void {
    this.storeService.dispatch(new ToggleNotifications());
  }
}
