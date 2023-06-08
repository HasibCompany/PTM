import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Global } from '@hasib/core/services';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./ptm.component.html"
})
export class PtmComponent implements OnInit {

  constructor(private global: Global, private router: Router) {

  }

  ngOnInit() {
    if (this.router.url == '/ptm') {
      let url = '/ptm/dashBoard';
      let operation = this.global.findOperation(this.global.navMenuItems, url);
      if (operation)
        this.router.navigate([url]);
    }
  }
}
