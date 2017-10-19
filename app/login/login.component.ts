import { Component, OnInit } from '@angular/core';



//import { AppService } from './../app.service';

@Component({
  //moduleId: module.id,
  selector: 'login.component.ts',
  templateUrl: './app/login/login.component.html'
})
export class LoginComponent implements OnInit {

  private browser: string;

  ngOnInit() {
    var ua = window.navigator.userAgent;
    var firefox = ua.indexOf('Firefox');

    if (firefox > 0) {
      this.browser = "Mozila";
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      this.browser = "IE";
    }

  };

  constructor() {
  };

}