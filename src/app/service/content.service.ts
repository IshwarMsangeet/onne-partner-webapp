import { Injectable } from '@angular/core';

import { AppState } from '../model/app-state.enum'

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  appState: AppState; // To know which content to be shown in left side
  leftSideWidth = '50%';
  rightSideWidth = '50%';

  constructor() { }
}
