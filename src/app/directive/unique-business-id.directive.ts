import { Directive } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ApiService } from '../service/api.service';

import { debounceTime, map, } from 'rxjs/operators';
import { ApiResponse } from '../model/api-response';

@Directive({
  selector: '[appUniqueBusinessId]'
})
export class UniqueBusinessIdDirective {

  constructor(private uniqueIdModel: NgModel, private apiService: ApiService) {
    
    this.uniqueIdModel.control.valueChanges.pipe(debounceTime(300)).subscribe( (id: string) =>  {
     //console.log('begin '+this.uniqueIdModel.control.valid);
      //this.uniqueIdModel.control.setErrors({"checking" : true});
      console.log(this.uniqueIdModel.control);
      if(id==undefined || id.length == 0){
        return;
      }

      if(this.uniqueIdModel.control.valid) {

          this.apiService.checkUniqueBusinessId(id).subscribe(
            (response: ApiResponse) => {
              this.uniqueIdModel.control.setErrors(null);
              //console.log(response);
              //console.log('after success' + this.uniqueIdModel.control.valid);
              //console.log(this.uniqueIdModel.control);
            },
            (error: any) => {
    
              console.log(error);
              if(error.status === 409) {
                this.uniqueIdModel.control.setErrors({"exists" : true});
              }
    
              //console.log(this.uniqueIdModel.control);
              //console.log('status '+error.status);
            // console.log('after failure' + this.uniqueIdModel.control.valid);
            }
          )
      }


      
    });    
    console.log('end' + this.uniqueIdModel.control.valid);
  }

}
