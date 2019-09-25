import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppState } from '../model/app-state.enum'
import { IVertical } from '../model/vertical';
import { ApiResponse } from '../model/api-response';

import { ContentService } from '../service/content.service';
import { ApiService } from '../service/api.service';


@Component({
  selector: 'app-main-verticals',
  templateUrl: './main-verticals.component.html',
  styleUrls: ['./main-verticals.component.css']
})
export class MainVerticalsComponent implements OnInit {

  verticals: IVertical[];
  errors:any;
  response:any;

  constructor(
    private contentService: ContentService,
    private apiService: ApiService,
    private router: Router) { }



  ngOnInit() {
    
    setTimeout(() => {
      this.contentService.appState = AppState.CHOOSE_MAIN_VERTICAL;
    });
    

    this.contentService.leftSideWidth = '40%';
    this.contentService.rightSideWidth = '60%';


    this.apiService.getAllVerticals().subscribe(
      (response:ApiResponse) => {

        //console.log(response);
        this.verticals = response['data'];             
      },
      (error:any)    => {
        console.log("Error: "+ error.message);
      }
    );

  }

  verticalSelected(item: IVertical) {

    this.router.navigate(['/sub-verticals'], { queryParams: { id: item.id } });
  }

}
