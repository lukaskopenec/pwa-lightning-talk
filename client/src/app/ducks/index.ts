import { ActionReducerMap } from '@ngrx/store';

import * as Refreshments from './refreshments';

import { Effects as RefreshmentsEffects } from './refreshments.effects';

export class AppState {
  refreshments: Refreshments.State = new Refreshments.State();
}

export const reducers: ActionReducerMap<AppState> = {
  refreshments: Refreshments.reducer as any,
};

export const effects = [
  RefreshmentsEffects,
];
