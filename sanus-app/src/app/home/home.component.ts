import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	currentUser: any;

	constructor(private router: Router,
		private authenticationService: AuthenticationService
	) {

		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
	}

	ngOnInit() {

	}

	logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
