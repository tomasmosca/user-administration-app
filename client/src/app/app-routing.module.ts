import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './guards/admin.guard';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {AuthenticatedGuard} from "./guards/auth.guard";
import {ProfileComponent} from "./profile/profile.component";
import {ProfileGuard} from "./guards/profile.guard";
import {PublicInfoComponent} from "./public-info/public-info.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthenticatedGuard]},
  { path: 'register', component: RegisterComponent},
  { path: 'public', component: PublicInfoComponent},
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard]},
  { path: 'error', component: PageNotFoundComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'error', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
