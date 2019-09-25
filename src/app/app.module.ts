import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
//import { MatSnackBarModule } from "@angular/material";

import { AppRoutingModule } from './app-routing.module';
import { CustomMaterialModule } from './custom-material/custom-material.module';


import { AppComponent } from './app.component';
import { MainVerticalsComponent } from './main-verticals/main-verticals.component';
import { VerticalGridComponent } from './vertical-grid/vertical-grid.component';
import { SubVerticalsComponent } from './sub-verticals/sub-verticals.component';
import { PartnerDetailsFormComponent } from './partner-details-form/partner-details-form.component';
import { FeaturesComponent } from './features/features.component';
import { UniqueBusinessIdDirective } from './directive/unique-business-id.directive';
import { UniqueUserIdDirective } from './directive/unique-user-id.directive';




@NgModule({
  declarations: [
    AppComponent,
    MainVerticalsComponent,
    VerticalGridComponent,
    SubVerticalsComponent,
    PartnerDetailsFormComponent,
    FeaturesComponent,
    UniqueBusinessIdDirective,
    UniqueUserIdDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
  ],
  entryComponents: [
    FeaturesComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
