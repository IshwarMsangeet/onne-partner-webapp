import { Component, OnInit, Inject,Input,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IFeature } from '../model/feature';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {

  @Input('data') public data: any;
  @Output('closed') closed = new EventEmitter<boolean>();

  constructor(private router: Router
    //private dialogRef: MatDialogRef<FeaturesComponent>,
    //@Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  onClickCreate() {
    this.router.navigate(['/partner-creation-form'], { queryParams: { id: this.data.id, name: this.data.name } });
    // this.dialogRef.close(this.data.id); // Dialog closed by clicking create button
  }

  onClose() {
 
    this.closed.emit(true);
  }

}
