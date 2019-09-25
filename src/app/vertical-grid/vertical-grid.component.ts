import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IVertical } from '../model/vertical';


@Component({
  selector: 'app-vertical-grid',
  templateUrl: './vertical-grid.component.html',
  styleUrls: ['./vertical-grid.component.css']
})
export class VerticalGridComponent implements OnChanges {

  @Input('verticals') verticals: IVertical[];
  @Output() selected = new EventEmitter<number>();
  cols: number = 2; // dynamically arrange items in material-grid

  fxLayoutGap :string;
  fxFlex :string;
  class :string;
  showingMainVertical:boolean;

  constructor(private router: Router) { }

  ngOnInit() {

    if (this.router.url.includes('main-verticals')) 
    {  
         this.showingMainVertical = true; 
    }
    else 
    {
        this.showingMainVertical = false; 
    }
  }

  ngOnChanges() {
    if(!this.verticals) {
      return;
    }
    let len = this.verticals.length;
    if(len == 1 || (len < 5 && len % 2 == 0)) {
      //2 cols
      this.class = 'double-grid';
      this.fxLayoutGap = '';
      this.fxFlex = '1 0 calc(50% - 60px)';
    } else {
      //3 cols
      this.class = 'triple-grid';
      this.fxLayoutGap = '';
      this.fxFlex = '1 0 calc(33.3% - 32px)';
    }
  }

  selectVertical(id: number) {
    //console.log(id);
    this.selected.emit(id);
  }

}
