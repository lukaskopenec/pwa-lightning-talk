import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom, delay, ignoreElements, tap } from 'rxjs/operators';

import { RefreshmentType, QuantityInfo, ErrorCause } from '@models';

import {
  Actions as RefreshmentsActions,
  ActionType,
  GetTypesSuccess,
  GetTypesFail,
  GetQuantity,
  GetQuantitySuccess,
  GetQuantityFail,
  PutOrder,
  PutOrderSuccess,
  PutOrderFail,
  selectors,
  Clear,
  NotificationsToggled,
} from './refreshments';
import { extractError } from '../utilities/errors';
import { StoreService } from '../store.service';

const baseUrl = '/api/refreshments';

let notificationSubscription: PushSubscription | null = null;

declare global {
  interface Window {
    swRegistration: ServiceWorkerRegistration;
    checkNotifications: () => Promise<void>;
  }
}
declare global {
  interface Window {
    swRegistration: ServiceWorkerRegistration;
    checkNotifications: () => Promise<void>;
  }
}

@Injectable()
export class Effects {
  readonly getTypes = createEffect(() => this.action$.pipe(
    ofType(RefreshmentsActions.GetTypes),
    switchMap(() => this.httpClient.get<RefreshmentType[]>(`${baseUrl}/types`).pipe(
      map(types => new GetTypesSuccess(types)),
      catchError(err => of(new GetTypesFail(extractError(err)))),
    )),
  ));

  readonly getQuantity = createEffect(() => this.action$.pipe(
    ofType(RefreshmentsActions.GetQuantity),
    switchMap((action: GetQuantity) => this.httpClient.get<QuantityInfo>(`${baseUrl}/quantity/${action.typeId}`).pipe(
      map(qInfo => qInfo.id === action.typeId ? new GetQuantitySuccess(qInfo.quantity) : new GetQuantityFail(ErrorCause.NotSpecified)),
      catchError(err => of(new GetQuantityFail(extractError(err)))),
    )),
  ));

  readonly putOrder = createEffect(() => this.action$.pipe(
    ofType(RefreshmentsActions.PutOrder),
    map((action: PutOrder) => action.quantity),
    withLatestFrom(this.storeService.select(selectors.selectSelectedType)),
    switchMap(([quantity, refreshmentType]) => this.httpClient.post(`${baseUrl}/order`, {
      quantity, refreshmentType, notificationSubscription,
    }).pipe(
      map(() => new PutOrderSuccess()),
      catchError(err => of(new PutOrderFail(extractError(err)))),
    )),
  ));

  readonly delayedClear = createEffect(() => this.action$.pipe(
    ofType(RefreshmentsActions.PutOrderSuccess),
    delay(3500),
    map(() => new Clear()),
  ));

  readonly initNotificationsState = createEffect(() => this.action$.pipe(
    ofType('@ngrx/effects/init'),
    tap(() => window.checkNotifications = this.checkNotifications),
  ), {dispatch: false});

  readonly toggleNotifications = createEffect(() => this.action$.pipe(
    ofType(RefreshmentsActions.ToggleNotifications),
    switchMap(() => from(toggleNotifications()).pipe(
      map(newValue => new NotificationsToggled(newValue)),
      catchError(() => of(new NotificationsToggled(false))),
    )),
  ));

  readonly checkNotifications = async () => {
    notificationSubscription = await window.swRegistration.pushManager.getSubscription();
    this.storeService.dispatch(new NotificationsToggled(notificationSubscription !== null));
  }

  constructor(private readonly action$: Actions<ActionType>, private httpClient: HttpClient, private storeService: StoreService) {}
}

async function toggleNotifications(): Promise<boolean> {
  notificationSubscription = await window.swRegistration.pushManager.getSubscription();
  if (!notificationSubscription) {
    try {
      const applicationServerKey = urlB64ToUint8Array('BHBJQ7Iq8ZoF6E7v0rkBmYDawrAn_n-ke3x956nZRexLdXmVGHihnAB-VKsMaIeV6dIV-MQPtWEeLR6L0ACRYfs');
      notificationSubscription = await window.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      return notificationSubscription !== null;
    } catch (err) {
      console.error('Failed to subscribe to push manager', err);
      return false;
    }
  } else {
    await notificationSubscription.unsubscribe();
    return false;
  }
}

const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
