import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppState } from '../model/app-state.enum';
import { ISubvertical } from '../model/subvertical';

import { ContentService } from '../service/content.service';
import { ApiService } from '../service/api.service';
import { ApiResponse } from '../model/api-response';



@Component({
  selector: 'app-sub-verticals',
  templateUrl: './sub-verticals.component.html',
  styleUrls: ['./sub-verticals.component.css']
})
export class SubVerticalsComponent implements OnInit {

  verticals: ISubvertical[];
  isShowModal: boolean = false;
  data = null;


  constructor(
    private contentService: ContentService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    setTimeout(() => {
      this.contentService.appState = AppState.CHOOSE_SUB_VERTICAL;
    });


    this.contentService.leftSideWidth  = '40%';
    this.contentService.rightSideWidth = '60%';


    this.apiService.getAllSubverticals(this.route.snapshot.queryParams.id).subscribe(
      (response:ApiResponse) => {
        this.verticals = response.data;            
      },
      (error:any)    => {
        console.log("Error: "+ error.message);
      }
    );

  }


  verticalSelected(item: ISubvertical) {

      this.apiService._selectedSubvertical    = item.subverticalName;

      this.apiService.getAllFeatures(item.id).subscribe(
        (response:ApiResponse) => {
          //console.log(response.data);
          this.contentService.appState = AppState.CHOOSE_FEATURE;
          this.data =  {features: response.data, title: item.subverticalName, id: item.id}; 
          this.isShowModal = true;        
        },
        (error:any)    => {
          console.log("Error: "+ error);

        }
      );
  }

  resetIsShowModal(flag: boolean) {

    this.contentService.appState = AppState.CHOOSE_SUB_VERTICAL;
    this.isShowModal = flag;
  }

}


