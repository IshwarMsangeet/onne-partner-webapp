import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


import { Observable, throwError } from 'rxjs';


import { ApiResponse } from '../model/api-response';
import { IPartnerAppOwner } from '../model/partner-app-owner';
import { IPartnerApp } from '../model/partner-app';
import { IUserLogin } from '../model/user-login';
import { IGenOtp } from '../model/gen-otp';
import { IVerifyOtp } from '../model/verify-otp';

import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _baseUrl:string = "http://139.59.19.75:3001";
  public _selectedSubvertical:string;
  public _authToken:string;

  constructor(private http: HttpClient) { }


  getAllVerticals() : Observable<ApiResponse> {

    return this.http.get<ApiResponse>(this._baseUrl + "/api/v1/mainverticals");
  }

  getAllSubverticals(verticalId:number) : Observable<ApiResponse> {

    return this.http.get<ApiResponse>(this._baseUrl + "/api/v1/mainverticals/" + verticalId + "/subverticals");

  }

  getAllFeatures(subverticalId:number) : Observable<ApiResponse> {

    return this.http.get<ApiResponse>(this._baseUrl + "/api/v1/subverticals/" + subverticalId);
  }

  
  getAllCountryCodes() {

    return this.http.get<ApiResponse>(this._baseUrl + "/api/v1/countrycodes");
    
  }


  checkUniqueBusinessId(swappId: string) : Observable<ApiResponse> {

    return this.http.get<ApiResponse>(this._baseUrl + "/partner/api/v1/" + swappId + "/check");
    
    // return this.http.get<ApiResponse>(this._serverBaseUrl + "/user/api/"+swappId+"/check").pipe(
    //   retry(1),
    //   catchError(this.handleError)
    // );
  }

  checkUniqueEndUserId(swappId: string) : Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this._baseUrl + "/user/api/v1/" + swappId + "/check");
  }

  generateOtp(input: IGenOtp) : Observable<ApiResponse> {

    return this.http.post<ApiResponse>(this._baseUrl + "/api/v1/otp", input);

  }

  verifyOtp(input:IVerifyOtp) : Observable<ApiResponse> {

    return this.http.post<ApiResponse>(this._baseUrl + "/api/v1/otp/verify", input);
    
  }

  createOwner(input:IPartnerAppOwner) : Observable<ApiResponse> {

    let headers = new HttpHeaders({
      'X-Auth-Token': this._authToken,
      'Content-Type': 'application/json',
    });

    let options = { headers: headers };


    return this.http.post<ApiResponse>(this._baseUrl + "/user/api/v1/register", input, options);

  }

  
  createApp(input:IPartnerApp) : Observable<ApiResponse> {

    let headers = new HttpHeaders({
      'X-Auth-Token': this._authToken,
      'Content-Type': 'application/json',
    });

    console.log("AuthToken: " + this._authToken);
    let options = { headers: headers };

    return this.http.post<ApiResponse>(this._baseUrl + "/partner/api/v1/app", input, options);
  }


  validateUser(input:IUserLogin) : Observable<ApiResponse> {


    return this.http.post<ApiResponse>(this._baseUrl + "/user/api/v1/login", input);
  }

  forgotOnneId(input:IGenOtp) : Observable<ApiResponse> {

    return this.http.post<ApiResponse>(this._baseUrl + "/user/api/v1/forgot", input);
  }



  private handleError(error: any): Observable<any> {
    console.log(error.statusText);
    return throwError(error);
  }

}
