import { Component } from '@angular/core';

import { ContentService } from './service/content.service';
import { AppState } from './model/app-state.enum'
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  logoUrl = '../assets/img/onne-logo.png';
  appStates = AppState;

  constructor(public contentService: ContentService, private apiService: ApiService) {}
}
