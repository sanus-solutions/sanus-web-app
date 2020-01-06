import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LivemapComponent } from './livemap/livemap.component';

import { AuthGuard } from './_helpers';
import { from } from 'rxjs';

const routes: Routes = [
	{ path: '', component: LandingPageComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'home', component: LandingPageComponent },
	{ path: 'livemap', component: LivemapComponent },

	// Otherwise direct to home
	{ path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
