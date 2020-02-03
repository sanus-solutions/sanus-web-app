import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SharedataService} from "./../_services/sharedata.service";

import { AuthenticationService } from '../_services'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	currentUser: any;
	message: any;

	constructor(private router: Router,
		private authenticationService: AuthenticationService,
		private data: SharedataService
	) {

		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
	}

	ngOnInit() {
		this.data.currentMessage.subscribe(message => this.message = message)
	}

	goToLiveMap() {
		this.router.navigateByUrl('/livemap', { skipLocationChange: false }).then(() => {
			this.router.navigate(['/livemap']);
			window.location.reload();
		}); 
	}

	logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
