import { Directive } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ApiService } from '../service/api.service';

import { debounceTime, map, } from 'rxjs/operators';
import { ApiResponse } from '../model/api-response';

@Directive({
  selector: '[appUniqueUserId]'
})
export class UniqueUserIdDirective {

  constructor(private uniqueUserIdModel: NgModel, private apiService: ApiService) { 

    this.uniqueUserIdModel.control.valueChanges.pipe(debounceTime(300)).subscribe( (id: string) =>  {
      //console.log('begin '+this.uniqueUserIdModel.control.valid);
      //this.uniqueUserIdModel.control.setErrors({"checking" : true});

      if(id == undefined || id.length == 0){
        return;
      }

      if(this.uniqueUserIdModel.control.valid) {

        this.apiService.checkUniqueEndUserId(id).subscribe(
          (response: ApiResponse) => {
            this.uniqueUserIdModel.control.setErrors(null);
            //console.log(response);
            //console.log('after success' + this.uniqueUserIdModel.control.valid);
            //console.log(this.uniqueIdModel.control);
          },
          (error: any) => {
  
            console.log(error);
            if(error.status === 409) {
              this.uniqueUserIdModel.control.setErrors({"exists" : true});
            }
  
  
          }
        )

      }
     
    });    

  
  }

}
