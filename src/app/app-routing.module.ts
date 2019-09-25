import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainVerticalsComponent } from './main-verticals/main-verticals.component';
import { SubVerticalsComponent } from './sub-verticals/sub-verticals.component';
import { PartnerDetailsFormComponent } from './partner-details-form/partner-details-form.component';

const routes: Routes = [
  { path: 'main-verticals', component: MainVerticalsComponent },
  { path: 'sub-verticals', component: SubVerticalsComponent },
  { path: 'partner-creation-form', component: PartnerDetailsFormComponent },
  { path: '**', redirectTo: 'main-verticals' },
 // { path: '', redirectTo: '/main-verticals', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
