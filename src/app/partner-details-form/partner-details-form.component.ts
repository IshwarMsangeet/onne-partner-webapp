import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';


import { AppState } from '../model/app-state.enum';
import { ICountryCode } from '../model/country-codes';
import { ApiResponse } from '../model/api-response';

import { ApiService } from '../service/api.service';
import { ContentService } from '../service/content.service';



@Component({
  selector: 'app-partner-details-form',
  templateUrl: './partner-details-form.component.html',
  styleUrls: ['./partner-details-form.component.css'],
  providers: [  
                { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false } },
             ]
})
export class PartnerDetailsFormComponent implements AfterViewInit {

  @ViewChild('partnerCreationForm') partnerForm:NgForm;
  @ViewChild('businessName') tabOneFirstItem:any;
  @ViewChild('businessId') tabOneSecondItem:any;
 
  
 
  isLinear        = true;
  submitted       = false;


  currentDate = new Date();
  /*
    *disable dates less than 13 years from now
    *to ensure people below 13 years are not able to register
    */
  maxDate =  new Date(this.currentDate.setFullYear(this.currentDate.getFullYear() - 13));
  minDate = new Date(1940, 0, 1);

  // Regex to validate special characters in input
  pattern:string = '[a-zA-Z0-9.-_ ]*';
 


  countryCodes: ICountryCode[];

  activeTab:number      = 1;


  choiceMade:boolean         = false;
  ownerSignUp:boolean        = false;
  ownerSignIn:boolean        = false;
  phoneCaptured:boolean      = false;
  phoneVerified:boolean      = false;
  isWaiting:boolean          = false;
  forgotUserId:boolean       = false;
  readyToCreateApp:boolean   = false;
  appCreated:boolean         = false;
  ownerCreated:boolean       = false;
 

  loadingMsg:string       = "";
  flagUrl                 = "https://restcountries.eu/data/ind.svg";

  businessDataValue = { name  : "", onne_id  : ""};
  ownerDataValue    = { 
                          onne_id   : "", 
                          fname     : "", 
                          lname     : "", 
                          dob       : new Date(0), 
                          gender    : "MALE", 
                          std_code  : "91", 
                          phone     : "" 
                      };


  businessIdAvailable:boolean = false;
  ownerIdAvailable:boolean;
  response:any;
 

  nextClass:string    = "next";
  hiddenClass:string  = "hidden";
  loadingClass:string = "loading";
  ownerClass:string   = "owner-block";




  constructor(
      private snackBar: MatSnackBar,
      private contentService: ContentService,
      private apiService: ApiService,
      private route: ActivatedRoute,
  ) {

    setTimeout(() => {
      this.contentService.appState  = AppState.CHOOSE_STEP_ONE;
    });

     this.apiService.getAllCountryCodes().subscribe(
        (response:ApiResponse) => {
          //console.log(response);
          this.countryCodes = response.data;     
        },
        (error:any) => {

          if(error.error.statusCode === 500) {
            this.snackBar.open('Failed to fetch Country Codes', '', { duration: 5000 });
          }
          return console.log('Error: ' + error.message);
        }
      );    
  }

  ngAfterViewInit() {
    
    //console.log(this.partnerForm);
   
 
  }

  setFlagValue(code:any) {

    this.flagUrl = code.flag;
    console.log(this.flagUrl);

  }



  onClickTab(tabId:number) {

    if(tabId == 1) 
    { 
      
      this.contentService.appState  = AppState.CHOOSE_STEP_ONE;
    }
    else if(tabId == 2)
    {
      
      if(!this.tabOneFirstItem.valid || !this.tabOneSecondItem.valid) {
        
        return false;
      }
      
      this.contentService.appState  = AppState.CHOOSE_STEP_TWO;
    }
    else
    {
  
      //console.log(this.partnerForm);
      if(!this.partnerForm.valid || !this.phoneVerified) {

        return false;
      }
      this.contentService.appState  = AppState.CHOOSE_STEP_THREE;
    }
  

    this.activeTab = tabId;
  }

  onClickSignUp() {

    this.choiceMade   = true;
    this.ownerSignIn  = false;
    this.ownerSignUp  = true;
  }

  onClickSignIn() {

    this.choiceMade   = true;
    this.ownerSignIn  = true;
    this.ownerSignUp  = false;
    

    this.phoneCaptured = false;
    this.phoneVerified = false;
  }

  onSelectGender(gender:string) {

    this.ownerDataValue.gender = gender;
  }


  onClickBack(phase:number) {

      /*
          1 = Should take to Choose Sign In or Sign Up Screen
          2 = Should take to Sign In with Onne Id Screen
          3 = Should take to Forgot Onne Id [Sign In Flow] edit phone number Screen
          4 = Should take to Edit Number [Sign Up Flow]

      */
     //console.log(phase);

      if(phase === 1) {

        this.choiceMade   = false;
        this.ownerSignIn  = false;
        this.ownerSignUp  = false;
      }
      else if(phase === 2) {

        this.onClickSignIn();

      }
      else if(phase === 3) {

      
        this.forgotUserId = false;
        this.onClickSignIn();
        
        
      }
      else {

        //case 4
        this.ownerSignUp   = true;
        this.choiceMade    = true;
        this.phoneCaptured = false;
        this.phoneVerified = false;

      }
  }


  onClickForgotUserId() {

    this.forgotUserId = true;
  }

  onIdentifyUserWithPhone(countryCode:string, mobileNumber:string) {

    this.isWaiting = true;
    this.ownerDataValue.std_code  = countryCode;
    this.ownerDataValue.phone     = mobileNumber;

    let input = {
      "countryCode" : '+' + this.ownerDataValue.std_code,
      "mobileNumber": this.ownerDataValue.phone
    }

    console.log(input);

    this.apiService.forgotOnneId(input).subscribe(
      (response:ApiResponse) => {
        console.log(response);

        this.ownerDataValue.onne_id = response.data.onneId;
        this.forgotUserId = false;
        this.phoneCaptured = false;
        this.isWaiting = false;
      },
      (error:any)    => {

        this.isWaiting = false;
        this.phoneCaptured = false;
        if(error.error.statusCode === 400) {
          this.snackBar.open('You entered an invalid mobile number');
        }
        else if(error.error.statusCode === 404) {
          this.snackBar.open('The mobile number you entered is not registered with Onne');
        }
        else {
          console.log("Error: " + error.message);
        }
        
        setTimeout(function(){ this.choiceMade = false; }, 6000);
       
        
      } 
    );
  }

  onSubmit() {

    if(!this.partnerForm.valid) {

      return;
    }

    this.isWaiting = true;

    //we are checking if app is ready to be created, that is if owner account is already set up
    if(!this.readyToCreateApp) {

      //we will create partnet app on the success callback of this function
      this.createPartnerAppOwner();
    }
    else {

      this.createPartnerApp()
    }
    
  }


  createPartnerAppOwner() {

       console.log(this.ownerDataValue.dob);
       //adding 1 to getMonth(), since Jan starts with 0
       let dob = this.ownerDataValue.dob.getMonth()+1 + "/" +this.ownerDataValue.dob.getDate() + "/" + this.ownerDataValue.dob.getFullYear();
       console.log(dob);
             //API to add owner
            let input = {
              "onneId"      : this.ownerDataValue.onne_id,
              "firstname"   : this.ownerDataValue.fname,
              "lastname"    : this.ownerDataValue.lname,
              "gender"      : this.ownerDataValue.gender,
              "dob"         : dob,
              "countryCode" : '+' + this.ownerDataValue.std_code,
              "mobileNumber": this.ownerDataValue.phone.toString()                      
            };

            console.log(input);
            this.apiService.createOwner(input).subscribe(
              (response:ApiResponse) => {

                  console.log(response);
                  if(response.statusCode === 200)
                  {
                    this.readyToCreateApp = true;
                    this.ownerCreated = true;
                    this.apiService._authToken = response.data.authToken; 
                    this. createPartnerApp();
                  }
              },
              (error:any)    => {

                this.readyToCreateApp = false;
                this.isWaiting = false;

                if(error.error.statusCode === 500) {

                  this.snackBar.open('Failed to create owner');
                }
                else if(error.error.statusCode === 409) {
                  
                  this.snackBar.open('The OnneId or Mobile number is already taken');
                }
                else if(error.error.statusCode === 401) {

                  this.snackBar.open('Authentication failed');
                }
                else if(error.error.statusCode === 400) {

                  this.snackBar.open('OnneId or Mobile number is invalid');
                }
                else {
                  console.log("Error: " + error.message);
                }
                
                
              } 
            );
  }


  createPartnerApp() {

      //API to create app
      let appInput = {
        "appBusinessName"         : this.businessDataValue.name,
        "onneBusinessId"          : this.businessDataValue.onne_id,
        "onneId"                  : this.ownerDataValue.onne_id,
        "subVertical"             : this.route.snapshot.queryParams.id.toString()
      };

      console.log(appInput);
      this.apiService.createApp(appInput).subscribe(
        (response:ApiResponse) => {

          this.contentService.leftSideWidth  = '60%';
          this.contentService.rightSideWidth = '40%';

          this.isWaiting = false;
          this.appCreated = true;

          this.contentService.appState  = AppState.APP_CREATED;
          console.log(response);


        },
        (error:any)    => {

          this.isWaiting = false;
          if(error.statusCode === 500) {

            this.snackBar.open('Failed to create your app');
          }
          else if(error.statusCode === 409) {
            
            this.snackBar.open('The Business OnneId is already taken');
          }
          else if(error.statusCode === 401) {

            this.snackBar.open('Authentication failed');
          }
          else {
            console.log(error);
            //console.log("Error: " + error.message);
          }
          
          
        } 
      );
  }

  valdateOnneId() {


    let input = {
      "onneId" : this.ownerDataValue.onne_id,
    }

    this.apiService.validateUser(input).subscribe(
      (response:ApiResponse) => {
        //console.log(response);
        this.phoneCaptured = true;
        this.response = 200;
      },
      (error:any)    => {
      
        this.phoneCaptured = false; 
      
        if(error.error.statusCode === 500) {

          this.snackBar.open('You have entered invalid OnneId');
        }
        else if(error.error.statusCode === 404) {
          
          this.snackBar.open('No User found with this OnneId');
        }
        else if(error.error.statusCode === 400) {

          this.snackBar.open('You have entered an Invalid Mobile Number');
        }
        else {
          console.log("Error: " + error.message);
        }
  
        
      } 
    );
  }




  onSendOtp(countryCode:string, mobileNumber:string) {


    this.isWaiting = true;
    this.ownerDataValue.std_code  = countryCode;
    this.ownerDataValue.phone     = mobileNumber;

    let input = {
      "countryCode" : '+' + this.ownerDataValue.std_code,
      "mobileNumber": this.ownerDataValue.phone
    }

   // console.log(input);

    this.apiService.generateOtp(input).subscribe(
      (response:ApiResponse) => {
        console.log(response);
        this.phoneCaptured = true;
        this.isWaiting = false;
      },
      (error:any)    => {
        this.isWaiting = false;
        this.phoneCaptured = false;
        
        if(error.error.statusCode === 500) {

          this.snackBar.open('Failed to send OTP');
        }
        else if(error.error.statusCode === 409) {
          
          this.snackBar.open('This Mobile Number already exist');
        }
        else if(error.error.statusCode === 400) {

          this.snackBar.open('You have entered an Invalid Mobile Number');
        }
        else {
          console.log("Error: " + error.message);
        }
        setTimeout(function(){ this.choiceMade = false; }, 6000);
        
        
      } 
    );

  }

  onVerifyOtp(otp:string) {

    this.isWaiting = true;
    let input:any;

    if(this.ownerSignUp) {

      input = {
        "countryCode" : '+' + this.ownerDataValue.std_code,
        "mobileNumber": this.ownerDataValue.phone,
        "otp"         : otp,
        "onneId"      : ""
      }

    }
    else {

      input = {
        "countryCode" : "",
        "mobileNumber": "",
        "otp"         : otp,
        "onneId"      : this.ownerDataValue.onne_id
      }    
    }
    

    console.log(input);

    this.apiService.verifyOtp(input).subscribe(
      (response:ApiResponse) => {

        this.apiService._authToken = response.data.authToken; 
      
        this.phoneVerified = true; 
        this.isWaiting = false;

        //if it is Sign In, then we can do directly to third tab and skip the process of creating Owner
        if(this.ownerSignIn) {

          this.readyToCreateApp = true;
          this.onClickTab(3);
        }
               
        console.log(response);


      },
      (error:any)    => {
        
          this.isWaiting = false;
          this.phoneVerified = false;
          if(error.error.statusCode === 500) {

            this.snackBar.open('Failed to verify OTP');
          }
          else if(error.error.statusCode === 404) {
            
            this.snackBar.open('User not found');
          }
          else if(error.error.statusCode === 400) {
  
            this.snackBar.open('Please enter OTP to verify');
          }
          else {
            console.log("Error: " + error.message);
          }
          
         

      }
    );

  }



}
