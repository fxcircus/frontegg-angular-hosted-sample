import { Component } from '@angular/core';
import { FronteggAppService } from '@frontegg/angular';

@Component({
  selector: 'show-admin-portal',
  template: '<button (click)="showAdminPortal()">Show Admin Portal</button>',
  styleUrls: ['./show-admin-portal.component.css']
})
export class ShowAdminPortalComponent {
  constructor(private fronteggAppService: FronteggAppService) { }

  showAdminPortal(): void {
    this.fronteggAppService?.showAdminPortal()
  }
}
